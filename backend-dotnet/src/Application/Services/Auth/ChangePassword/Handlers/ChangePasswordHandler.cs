
using Application.Interface;
using Application.Interface.Security;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Auth.ChangePassword.Handlers;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, bool>
{
    private readonly IUserRepository _write;
    private readonly IUserReadRepository _read;
    private readonly ITenantContext _tenant;
    private readonly IPasswordHasher _hasher;

    public ChangePasswordHandler(
        IUserRepository write,
        IUserReadRepository read,
        ITenantContext tenant,
        IPasswordHasher hasher)
    {
        _write = write;
        _read = read;
        _tenant = tenant;
        _hasher = hasher;
    }

    public async Task<bool> Handle(ChangePasswordCommand request, CancellationToken ct)
    {
        var user = await _write.GetByIdAsync(_tenant.UserId)
                   ?? throw new UnauthorizedAccessException("User not found");

        if (!_hasher.Verify(user.PasswordHash, request.Dto.CurrentPassword))
            throw new UnauthorizedAccessException("Current password incorrect");

        user.PasswordHash = _hasher.Hash(request.Dto.NewPassword);

        await _write.UpdateAsync(user);
        return true;
    }
}