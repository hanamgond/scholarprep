using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Queries;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;

public class GetEnrollmentsByClassHandler :
    IRequestHandler<GetEnrollmentsByClassQuery, List<EnrollmentDto>>
{
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly ITenantContext _tenant;

    public GetEnrollmentsByClassHandler(IEnrollmentReadRepository readRepo, ITenantContext tenant)
    {
        _readRepo = readRepo;
        _tenant = tenant;
    }

    public async Task<List<EnrollmentDto>> Handle(GetEnrollmentsByClassQuery request, CancellationToken ct)
    {
        var list = await _readRepo.GetByClassAsync(request.ClassId);

        // CampusAdmin cannot access other campus
        if (_tenant.Role == UserRole.CampusAdmin &&
            list.Any(e => e.CampusId != _tenant.CampusId))
            throw new UnauthorizedAccessException();

        return list.ToList();
    }
}
