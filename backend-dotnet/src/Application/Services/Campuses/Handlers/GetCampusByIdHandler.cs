using Application.DTO.Core;
using Application.Interface;
using Application.Services.Campuses.Queries;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Campuses.Handlers;

public class GetCampusByIdHandler : IRequestHandler<GetCampusByIdQuery, CampusDto>
{
    private readonly ICampusReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetCampusByIdHandler(ICampusReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<CampusDto> Handle(GetCampusByIdQuery request, CancellationToken ct)
    {
        var dto = await _read.GetByIdAsync(request.CampusId)
                  ?? throw new KeyNotFoundException("Campus not found.");

        if (dto.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException("Tenant mismatch.");

        // CampusAdmin allowed to read only their campus:
        if (_tenant.Role == UserRole.CampusAdmin && dto.Id != _tenant.CampusId)
            throw new UnauthorizedAccessException("Access denied.");

        return dto;
    }
}
