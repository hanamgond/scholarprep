using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Commands;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;

public class DeleteEnrollmentHandler : IRequestHandler<DeleteEnrollmentCommand, bool>
{
    private readonly IEnrollmentRepository _efRepo;
    private readonly ITenantContext _tenant;

    public DeleteEnrollmentHandler(IEnrollmentRepository efRepo, ITenantContext tenant)
    {
        _efRepo = efRepo;
        _tenant = tenant;
    }

    public async Task<bool> Handle(DeleteEnrollmentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _efRepo.GetByIdAsync(request.EnrollmentId);
        if (entity == null || entity.TenantId != _tenant.TenantId)
            return false;

        // Role restrictions
        if (_tenant.Role == UserRole.Teacher || _tenant.Role == UserRole.Student)
            throw new UnauthorizedAccessException("You cannot delete enrollments.");

        // Campus admin permission check
        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("You cannot delete enrollments from another campus.");

        await _efRepo.SoftDeleteAsync(request.EnrollmentId);
        return true;
    }
}
