using Application.DTO.Core;
using Application.Interface;
using Application.Interface.Security;
using Domain.Core.Entities;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Users.Handlers;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IUserRepository _write;
    private readonly IUserReadRepository _read;
    private readonly ITenantContext _tenant;
    private readonly IPasswordHasher _hasher;

    public CreateUserHandler(IUserRepository write, IUserReadRepository read, ITenantContext tenant, IPasswordHasher hasher)
    {
        _write = write;
        _read = read;
        _tenant = tenant;
        _hasher = hasher;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var dto = request.Dto;

        // ---- Permissions ----
        if (_tenant.Role is UserRole.Student or UserRole.Teacher)
            throw new UnauthorizedAccessException("Not allowed");

        if (_tenant.Role == UserRole.CampusAdmin && dto.Role is UserRole.TenantAdmin or UserRole.SuperAdmin)
            throw new UnauthorizedAccessException("CampusAdmin cannot create higher roles");

        if (_tenant.Role == UserRole.CampusAdmin && dto.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("CampusAdmin cannot create users for another campus");

        // ---- Uniqueness ----
        var existing = await _write.GetByEmailAsync(dto.Email.ToLowerInvariant());
        if (existing != null)
            throw new Exception("Email already exists");

        var user = new User
        {
            TenantId = _tenant.TenantId,
            CampusId = dto.CampusId,
            Email = dto.Email.ToLowerInvariant(),
            PasswordHash = _hasher.Hash(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Role = dto.Role,
            IsActive = dto.IsActive
        };

        var created = await _write.AddAsync(user);
        return await _read.GetByIdAsync(created.Id)
               ?? throw new Exception("Read failed after creation");
    }
}

