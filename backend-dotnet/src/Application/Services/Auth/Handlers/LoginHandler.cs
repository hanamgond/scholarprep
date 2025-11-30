using Application.DTO.Auth;
using Application.Interface;
using Application.Interface.Core.EF;
using Application.Interface.Security;
using Application.Services.Auth.Commands;
using Domain.Core.Entities;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Auth.Handlers;

public class LoginHandler : IRequestHandler<LoginCommand, AuthResultDto>
{
    private readonly IUserReadRepository _userRead;
    private readonly IUserRepository _userWrite;
    private readonly IRefreshTokenRepository _refresh;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokenService;
    private readonly ITenantContext _tenant;

    public LoginHandler(
        IUserReadRepository userRead,
        IUserRepository userWrite,
        IRefreshTokenRepository refresh,
        IPasswordHasher hasher,
        ITokenService tokenService,
        ITenantContext tenant)
    {
        _userRead = userRead;
        _userWrite = userWrite;
        _refresh = refresh;
        _hasher = hasher;
        _tokenService = tokenService;
        _tenant = tenant;
    }

    public async Task<AuthResultDto> Handle(LoginCommand request, CancellationToken ct)
    {
        var dto = request.Dto;

        var user = await _userRead.GetByEmailAsync(dto.Email.ToLowerInvariant())
                   ?? throw new UnauthorizedAccessException("Invalid credentials");

        if (user.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException("Invalid tenant");

        var userEntity = await _userWrite.GetByIdAsync(user.Id)
                         ?? throw new UnauthorizedAccessException("Invalid account");

        if (!_hasher.Verify(userEntity.PasswordHash, dto.Password))
            throw new UnauthorizedAccessException("Invalid credentials");

        // Generate access token
        var auth = _tokenService.GenerateTokens(user);

        // Create refresh token (raw + hash)
        var (rawRefresh, refreshHash) = _tokenService.GenerateRefreshToken();

        var tokenEntity = new RefreshToken
        {
            TenantId = user.TenantId,
            UserId = user.Id,
            TokenHash = refreshHash,
            ExpiresAt = auth.RefreshTokenExpiresAt
        };

        await _refresh.AddAsync(tokenEntity);

        return new AuthResultDto(
            auth.AccessToken,
            rawRefresh,
            auth.AccessTokenExpiresAt,
            auth.RefreshTokenExpiresAt,
            user.Role
        );
    }
}


