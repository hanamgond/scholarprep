using Application.DTO.Core;
using Application.Interface;
using Application.Services.Campuses.Queries;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Campuses.Handlers;

public class GetCampusesByTenantHandler : IRequestHandler<GetCampusesByTenantQuery, List<CampusDto>>
{
    private readonly ICampusReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetCampusesByTenantHandler(ICampusReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<List<CampusDto>> Handle(GetCampusesByTenantQuery request, CancellationToken ct)
    {
        // TenantAdmin and SuperAdmin allowed; CampusAdmin may only see their campus (filter later)
        if(_tenant.Role != UserRole.TenantAdmin && _tenant.Role != UserRole.SuperAdmin && _tenant.Role != UserRole.CampusAdmin)
            throw new UnauthorizedAccessException("Insufficient permissions to access campuses.");

        if((_tenant.Role == UserRole.TenantAdmin || _tenant.Role == UserRole.CampusAdmin) && request.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException("Can access campus under own tenant only");

        var list = await _read.GetByTenantAsync(request.TenantId);
        if (_tenant.Role == UserRole.CampusAdmin)
            list = list.Where(c => c.Id == _tenant.CampusId).ToList();

        return list.ToList();
    }
}
