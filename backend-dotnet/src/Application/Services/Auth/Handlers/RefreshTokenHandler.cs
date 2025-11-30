using Application.DTO.Auth;
using Application.Interface.Core.EF;
using Application.Interface.Security;
using Application.Services.Auth.Commands;
using Domain.Core.Entities;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, AuthResultDto>
{
    private readonly IRefreshTokenRepository _refreshRepo;
    private readonly IUserReadRepository _userReadRepo;
    private readonly ITokenService _tokenService;

    public RefreshTokenHandler(
        IRefreshTokenRepository refreshRepo,
        IUserReadRepository userReadRepo,
        ITokenService tokenService)
    {
        _refreshRepo = refreshRepo;
        _userReadRepo = userReadRepo;
        _tokenService = tokenService;
    }

    public async Task<AuthResultDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // --- 1) Hash the incoming refresh token ---
        using var sha = SHA256.Create();
        var incomingHash = Convert.ToBase64String(
            sha.ComputeHash(Encoding.UTF8.GetBytes(request.Dto.RefreshToken)));

        // --- 2) Load stored token ---
        var stored = await _refreshRepo.GetByTokenHashAsync(incomingHash)
                     ?? throw new UnauthorizedAccessException("Invalid refresh token");

        // --- 3) Validate token state ---
        if (stored.IsRevoked)
        {
            // REUSE DETECTED → revoke entire family
            var allUserTokens = await _refreshRepo.GetActiveTokensForUserAsync(stored.UserId);

            foreach (var t in allUserTokens)
            {
                t.IsRevoked = true;
                t.RevokedByIp = "reuse-detected";
                await _refreshRepo.UpdateAsync(t);
            }

            throw new SecurityTokenException("Token reuse detected. All sessions for this user have been revoked.");
        }

        if (stored.ExpiresAt <= DateTime.UtcNow)
            throw new SecurityTokenException("Refresh token expired");

        // --- 4) Load user ---
        var user = await _userReadRepo.GetByIdAsync(stored.UserId)
                   ?? throw new UnauthorizedAccessException("User not found");

        // --- 5) Issue new Access Token ---
        var newTokens = _tokenService.GenerateTokens(user);

        // --- 6) ROTATE Refresh Token ---
        var (newRawToken, newTokenHash) = _tokenService.GenerateRefreshToken();

        var newRefresh = new RefreshToken
        {
            TenantId = user.TenantId,
            UserId = user.Id,
            TokenHash = newTokenHash,
            ExpiresAt = newTokens.RefreshTokenExpiresAt,
            CreatedByIp = "refresh"
        };

        await _refreshRepo.AddAsync(newRefresh);

        // link the old token → new token
        stored.IsRevoked = true;
        stored.RevokedByIp = "rotated";
        stored.ReplacedByTokenId = newRefresh.Id;

        await _refreshRepo.UpdateAsync(stored);

        return new AuthResultDto(
            newTokens.AccessToken,
            newRawToken,
            newTokens.AccessTokenExpiresAt,
            newRefresh.ExpiresAt,
            user.Role
        );
    }
}