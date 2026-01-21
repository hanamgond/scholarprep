using Application.DTO.Core;
using Application.Interface;
using Application.Services.Tenants.Queries;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Tenants.Handlers;

public class GetAllTenantsHandler : IRequestHandler<GetAllTenantsQuery, List<TenantDto>>
{
    private readonly ITenantReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetAllTenantsHandler(ITenantReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<List<TenantDto>> Handle(GetAllTenantsQuery request, CancellationToken ct)
    {
        if (_tenant.Role != UserRole.SuperAdmin)
            throw new UnauthorizedAccessException();

        var list = await _read.GetAllAsync();
        return list.ToList();
    }
}
