using Application.Interface;
using Application.Services.Tenants.Commands;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Tenants.Handlers;

public class DeleteTenantHandler : IRequestHandler<DeleteTenantCommand, bool>
{
    private readonly ITenantRepository _repo;
    private readonly ITenantContext _tenant;

    public DeleteTenantHandler(ITenantRepository repo, ITenantContext tenant)
    {
        _repo = repo;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteTenantCommand request, CancellationToken ct)
    {
        if (_tenant.Role != UserRole.SuperAdmin)
            throw new UnauthorizedAccessException();

        var found = await _repo.GetByIdAsync(request.TenantId);
        if (found == null) return false;

        await _repo.SoftDeleteAsync(request.TenantId);
        return true;
    }
}
