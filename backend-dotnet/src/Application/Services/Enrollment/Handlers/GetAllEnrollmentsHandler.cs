using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Queries;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;

public class GetAllEnrollmentsHandler :
    IRequestHandler<GetAllEnrollmentsQuery, List<EnrollmentDto>>
{
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly ITenantContext _tenant;

    public GetAllEnrollmentsHandler(IEnrollmentReadRepository readRepo, ITenantContext tenant)
    {
        _readRepo = readRepo;
        _tenant = tenant;
    }

    public async Task<List<EnrollmentDto>> Handle(GetAllEnrollmentsQuery request, CancellationToken ct)
    {
        var list = await _readRepo.GetAllAsync(_tenant.TenantId);

        // CampusAdmin only sees own campus records
        if (_tenant.Role == UserRole.CampusAdmin)
            list = list.Where(e => e.CampusId == _tenant.CampusId);

        return list.ToList();
    }
}
