
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Sections.Commands;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Sections.Handlers;

public class DeleteSectionHandler : IRequestHandler<DeleteSectionCommand, bool>
{
    private readonly ISectionRepository _repo;
    private readonly ITenantContext _tenant;

    public DeleteSectionHandler(ISectionRepository repo, ITenantContext tenant)
    {
        _repo = repo;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteSectionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.SectionId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            return false;

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Campus admin cannot delete other campus's section.");

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        await _repo.UpdateAsync(entity);
        return true;
    }
}
