using Application.DTO.Core;
using Application.Interface;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class GetUsersByCampusHandler : IRequestHandler<GetUsersByCampusQuery, List<UserDto>>
{
    private readonly IUserReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetUsersByCampusHandler(IUserReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<List<UserDto>> Handle(GetUsersByCampusQuery request, CancellationToken ct)
    {
        if (_tenant.Role == UserRole.CampusAdmin &&
            request.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException();

        var list = await _read.GetByCampusAsync(request.CampusId);
        return list.ToList();
    }
}
