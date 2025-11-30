using Application.Interface;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IUserRepository _write;
    private readonly ITenantContext _tenant;

    public DeleteUserHandler(IUserRepository write, ITenantContext tenant)
    {
        _write = write;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        var entity = await _write.GetByIdAsync(request.UserId);
        if (entity == null) return false;

        // Tenant isolation
        if (entity.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException();

        // Campus admin restriction
        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException();

        await _write.SoftDeleteAsync(entity.Id);
        return true;
    }
}
