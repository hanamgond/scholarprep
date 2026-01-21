using Application.DTO.Core;
using Application.Interface;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class GetUsersByTenantHandler : IRequestHandler<GetUsersByTenantQuery, List<UserDto>>
{
    private readonly IUserReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetUsersByTenantHandler(IUserReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<List<UserDto>> Handle(GetUsersByTenantQuery request, CancellationToken ct)
    {
        var tenantIdToQuery = _tenant.Role == UserRole.SuperAdmin
                                 ? (request.TenantId ?? throw new Exception("SuperAdmin Must pass TenantId"))
                                 : _tenant.TenantId;

        var list = await _read.GetByTenantAsync(tenantIdToQuery);

        if (_tenant.Role == UserRole.CampusAdmin)
            list = list.Where(x => x.CampusId == _tenant.CampusId);

        return list.ToList();
    }
}

