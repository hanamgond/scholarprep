using Application.Interface.Core.EF;
using Application.Services.Auth.Commands;
using MediatR;
using System.Security.Cryptography;
using System.Text;

namespace Application.Services.Auth.Handlers;

public class RevokeRefreshTokenHandler : IRequestHandler<RevokeRefreshTokenCommand, bool>
{
    private readonly IRefreshTokenRepository _refreshRepo;

    public RevokeRefreshTokenHandler(IRefreshTokenRepository refreshRepo)
    {
        _refreshRepo = refreshRepo;
    }

    public async Task<bool> Handle(RevokeRefreshTokenCommand request, CancellationToken cancellationToken)
    {
        using var sha = SHA256.Create();
        var hash = Convert.ToBase64String(
            sha.ComputeHash(Encoding.UTF8.GetBytes(request.Dto.RefreshToken)));

        var stored = await _refreshRepo.GetByTokenHashAsync(hash);
        if (stored == null) return false;

        stored.IsRevoked = true;
        stored.RevokedByIp = "manual-revoke";

        await _refreshRepo.UpdateAsync(stored);

        return true;
    }
}

