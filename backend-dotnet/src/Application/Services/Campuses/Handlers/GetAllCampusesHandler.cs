using Application.DTO.Core;
using Application.Interface;
using Application.Services.Campuses.Queries;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Campuses.Handlers;

public class GetAllCampusesHandler : IRequestHandler<GetAllCampusesQuery, List<CampusDto>>
{
    private readonly ICampusReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetAllCampusesHandler(ICampusReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<List<CampusDto>> Handle(GetAllCampusesQuery request, CancellationToken ct)
    {
        var list = await _read.GetAllAsync(_tenant.TenantId);
        if (_tenant.Role == UserRole.CampusAdmin)
            list = list.Where(c => c.Id == _tenant.CampusId).ToList();

        return list.ToList();
    }
}