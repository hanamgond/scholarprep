using Application.DTO.Core;
using Application.Interface;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class GetUserByEmailHandler : IRequestHandler<GetUserByEmailQuery, UserDto>
{
    private readonly IUserReadRepository _read;
    private readonly ITenantContext _tenant;

    public GetUserByEmailHandler(IUserReadRepository read, ITenantContext tenant)
    {
        _read = read;
        _tenant = tenant;
    }

    public async Task<UserDto> Handle(GetUserByEmailQuery request, CancellationToken ct)
    {
        var dto = await _read.GetByEmailAsync(request.Email)
                  ?? throw new KeyNotFoundException("User not found");

        if (_tenant.Role == UserRole.SuperAdmin)
            return dto;

        if (dto.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException();

        if (_tenant.Role == UserRole.CampusAdmin &&
            dto.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException();

        return dto;
    }
}
