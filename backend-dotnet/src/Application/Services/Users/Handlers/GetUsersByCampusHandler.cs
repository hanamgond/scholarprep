using Application.DTO.Core;
using Application.Interface;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class GetUsersByCampusHandler : IRequestHandler<GetUsersByCampusQuery, List<UserDto>>
{
    private readonly IUserReadRepository _read;
    private readonly ICampusReadRepository _campusReadRepository;
    private readonly ITenantContext _tenant;

    public GetUsersByCampusHandler(IUserReadRepository read, ICampusReadRepository campusReadRepository, ITenantContext tenant)
    {
        _read = read;
        _campusReadRepository = campusReadRepository;
        _tenant = tenant;
    }

    public async Task<List<UserDto>> Handle(GetUsersByCampusQuery request, CancellationToken ct)
    {
        if (_tenant.Role == UserRole.SuperAdmin)
            return (await _read.GetByCampusAsync(request.CampusId)).ToList();

        else if (_tenant.Role == UserRole.TenantAdmin)
        {
            // ensure this campus is under the tenant
           var campus = await _campusReadRepository.GetByIdAsync(request.CampusId);
            if (campus == null) 
                throw new UnauthorizedAccessException("Can not access users of other tenants campus");
        }

        else if (_tenant.Role == UserRole.CampusAdmin &&
            request.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException();

        var list = await _read.GetByCampusAsync(request.CampusId);
        return list.ToList();
    }
}
