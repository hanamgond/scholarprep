using Application.Interface;
using Application.Services.Campuses.Commands;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Campuses.Handlers;


public class DeleteCampusHandler : IRequestHandler<DeleteCampusCommand, bool>
{
    private readonly ICampusRepository _repo;
    private readonly ITenantContext _tenant;

    public DeleteCampusHandler(ICampusRepository repo, ITenantContext tenant)
    {
        _repo = repo;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteCampusCommand request, CancellationToken ct)
    {
        if (_tenant.Role != UserRole.SuperAdmin && _tenant.Role != UserRole.TenantAdmin)
            throw new UnauthorizedAccessException("Only SuperAdmin or TenantAdmin can delete campuses.");

        var entity = await _repo.GetByIdAsync(request.CampusId);
        if (entity == null || entity.TenantId != _tenant.TenantId) return false;

        // Additional check: if campus has classes/students, reject or require cascade
        // (you can implement a check here)

        await _repo.SoftDeleteAsync(request.CampusId);
        return true;
    }
}
