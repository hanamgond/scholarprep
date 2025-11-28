using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Queries;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;

public class GetEnrollmentsByCampusHandler :
    IRequestHandler<GetEnrollmentsByCampusQuery, List<EnrollmentDto>>
{
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly ITenantContext _tenant;

    public GetEnrollmentsByCampusHandler(IEnrollmentReadRepository readRepo, ITenantContext tenant)
    {
        _readRepo = readRepo;
        _tenant = tenant;
    }

    public async Task<List<EnrollmentDto>> Handle(GetEnrollmentsByCampusQuery request, CancellationToken ct)
    {
        if (_tenant.Role == UserRole.CampusAdmin &&
            request.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException();

        var list = await _readRepo.GetByCampusAsync(request.CampusId);
        return list.ToList();
    }
}

