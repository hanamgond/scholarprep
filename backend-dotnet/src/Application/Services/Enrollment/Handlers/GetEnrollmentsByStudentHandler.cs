using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Queries;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;


public class GetEnrollmentsByStudentHandler
    : IRequestHandler<GetEnrollmentsByStudentQuery, List<EnrollmentDto>>
{
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly ITenantContext _tenant;

    public GetEnrollmentsByStudentHandler(
        IEnrollmentReadRepository readRepo,
        ITenantContext tenant)
    {
        _readRepo = readRepo;
        _tenant = tenant;
    }

    public async Task<List<EnrollmentDto>> Handle(GetEnrollmentsByStudentQuery request, CancellationToken cancellationToken)
    {
        var list = await _readRepo.GetByStudentAsync(request.StudentId);

        if (!list.Any())
            return new List<EnrollmentDto>();

        // Tenant check
        if (list.First().TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException("Unauthorized tenant access.");

        // Campus Admin cannot read enrollments of other campuses
        if (_tenant.Role == UserRole.CampusAdmin &&
            list.Any(e => e.CampusId != _tenant.CampusId))
            throw new UnauthorizedAccessException("Not allowed: cross-campus access.");

        return list.ToList();
    }
}
