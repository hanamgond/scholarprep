using Application.DTO.Core;
using Application.Interface;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IUserRepository _write;
    private readonly IUserReadRepository _read;
    private readonly ITenantContext _tenant;

    public UpdateUserHandler(IUserRepository write, IUserReadRepository read, ITenantContext tenant)
    {
        _write = write;
        _read = read;
        _tenant = tenant;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        var entity = await _write.GetByIdAsync(request.UserId)
                     ?? throw new KeyNotFoundException("User not found");

        // ---- Permissions ----
        if (_tenant.Role is UserRole.Teacher or UserRole.Student)
            throw new UnauthorizedAccessException();

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException();

        // CampusAdmin cannot update role of a TenantAdmin or SuperAdmin
        if (_tenant.Role == UserRole.CampusAdmin &&
            request.Dto.Role is UserRole.TenantAdmin or UserRole.SuperAdmin)
            throw new UnauthorizedAccessException();

        // ---- Update Fields ----
        if (request.Dto.FirstName is not null)
            entity.FirstName = request.Dto.FirstName;

        if (request.Dto.LastName is not null)
            entity.LastName = request.Dto.LastName;

        if (request.Dto.CampusId is Guid newCampus &&
            _tenant.Role != UserRole.CampusAdmin)
            entity.CampusId = newCampus;

        if (request.Dto.IsActive is bool active)
            entity.IsActive = active;

        if (request.Dto.Role is UserRole newRole &&
            _tenant.Role != UserRole.CampusAdmin)
            entity.Role = newRole;

        await _write.UpdateAsync(entity);

        return await _read.GetByIdAsync(entity.Id)
               ?? throw new Exception("Failed to read updated user");
    }
}
