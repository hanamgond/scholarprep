using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Queries;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;

public class GetEnrollmentByIdHandler : IRequestHandler<GetEnrollmentByIdQuery, EnrollmentDto>
{
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly ITenantContext _tenant;

    public GetEnrollmentByIdHandler(IEnrollmentReadRepository readRepo, ITenantContext tenant)
    {
        _readRepo = readRepo;
        _tenant = tenant;
    }

    public async Task<EnrollmentDto> Handle(GetEnrollmentByIdQuery request, CancellationToken cancellationToken)
    {
        var dto = await _readRepo.GetByIdAsync(request.EnrollmentId);

        if (dto == null || dto.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Enrollment not found.");

        // Campus Admin cannot read outside campus
        if (_tenant.Role == UserRole.CampusAdmin && dto.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Not allowed.");

        return dto;
    }
}
