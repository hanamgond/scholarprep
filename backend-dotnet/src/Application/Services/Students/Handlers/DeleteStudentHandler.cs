
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Commands;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Students.Handlers;

public class DeleteStudentHandler : IRequestHandler<DeleteStudentCommand, bool>
{
    private readonly IStudentRepository _repo;
    private readonly ITenantContext _tenant;

    public DeleteStudentHandler(IStudentRepository repo, ITenantContext tenant)
    {
        _repo = repo;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.StudentId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            return false;

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Campus admin cannot delete students of another campus.");

        entity.IsDeleted = true;
        entity.UpdatedBy = _tenant.UserId;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(entity);

        return true;
    }
}
