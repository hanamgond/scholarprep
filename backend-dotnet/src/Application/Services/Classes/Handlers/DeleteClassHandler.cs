
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Classes.Commands;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Classes.Handlers;

public class DeleteClassHandler : IRequestHandler<DeleteClassCommand, bool>
{
    private readonly IClassRepository _repo;
    private readonly ITenantContext _tenant;

    public DeleteClassHandler(IClassRepository repo, ITenantContext tenant)
    {
        _repo = repo;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteClassCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.ClassId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            return false;

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Campus admin cannot delete classes of other campuses.");

        // soft delete
        await _repo.SoftDeleteAsync(entity.Id);
        return true;
    }
}
