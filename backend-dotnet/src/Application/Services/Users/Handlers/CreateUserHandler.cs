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
    private readonly ICampusReadRepository _campusReadRepository;

    public CreateUserHandler(IUserRepository write, IUserReadRepository read, ITenantContext tenant, IPasswordHasher hasher, ICampusReadRepository campusReadRepository)
    {
        _write = write;
        _read = read;
        _tenant = tenant;
        _hasher = hasher;
        _campusReadRepository = campusReadRepository;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var dto = request.Dto;

        //----Permissions----
        //if (_tenant.Role is UserRole.Student or UserRole.Teacher)
        //    throw new UnauthorizedAccessException("Not allowed");

        //if (_tenant.Role == UserRole.CampusAdmin && dto.Role is UserRole.TenantAdmin or UserRole.SuperAdmin)
        //    throw new UnauthorizedAccessException("CampusAdmin cannot create higher roles");

        //if (_tenant.Role == UserRole.CampusAdmin && dto.CampusId != _tenant.CampusId)
        //    throw new UnauthorizedAccessException("CampusAdmin cannot create users for another campus");

        // ---- Uniqueness ----
        var existing = await _write.GetByEmailAsync(dto.Email.ToLowerInvariant());
        if (existing != null)
            throw new Exception("Email already exists");
               
        var user = new User
        {
            Email = dto.Email.ToLowerInvariant(),
            PasswordHash = _hasher.Hash(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Role = dto.Role,
            IsActive = dto.IsActive
        };
        // ============================================================
        // 1) SUPERADMIN (SYSTEM-LEVEL)
        // ============================================================
        if (_tenant.Role == UserRole.SuperAdmin)
        {
            if (dto.Role == UserRole.SuperAdmin)
            {
                // Create system-level super admin
                user.TenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
                user.CampusId = Guid.Empty;
            }
            else if (dto.Role == UserRole.TenantAdmin)
            {
                if (dto.TenantId is null)
                    throw new Exception("TenantId is required for creating TenantAdmin.");

                user.TenantId = dto.TenantId.Value;
                user.CampusId = Guid.Empty;
            }
            else if (dto.Role == UserRole.CampusAdmin)
            {
                if (dto.TenantId is null || dto.CampusId is null)
                    throw new Exception("TenantId and CampusId are required for creating CampusAdmin.");
                                
                var campus = await _campusReadRepository.GetByIdAsync(dto.CampusId.Value, dto.TenantId.Value);
                if (campus is null)
                    throw new UnauthorizedAccessException("Campus does not belong to the specified tenant.");

                user.TenantId = dto.TenantId.Value;
                user.CampusId = dto.CampusId.Value;

            }
            else
            {
                throw new UnauthorizedAccessException("SuperAdmin cannot directly create Teacher/Student.");
            }
        }
        // ============================================================
        // 2) TENANT ADMIN 
        // ============================================================
        else if (_tenant.Role == UserRole.TenantAdmin)
        {
            if (dto.TenantId is not null && dto.TenantId != _tenant.TenantId)
                throw new UnauthorizedAccessException("Cannot create user for different tenant.");

            user.TenantId = _tenant.TenantId;

            if (dto.Role == UserRole.SuperAdmin)
                throw new UnauthorizedAccessException("TenantAdmin cannot create SuperAdmin.");

            if (dto.Role == UserRole.TenantAdmin)
                throw new UnauthorizedAccessException("TenantAdmin cannot create another TenantAdmin.");

            if (dto.Role == UserRole.CampusAdmin)
            {
                if (dto.CampusId is null)
                    throw new Exception("CampusId is required.");
                var campusDto =  await _campusReadRepository.GetByIdAsync(dto.CampusId.Value, _tenant.TenantId);
                // ensure campus belongs to the same tenant
                if (campusDto is null)                    
                    throw new UnauthorizedAccessException("Campus does not belong to tenant.");

                user.CampusId = dto.CampusId.Value;
            }
            else  // Teacher or Student
            {
                if (dto.CampusId is null)
                    throw new Exception("CampusId is required.");

                user.CampusId = dto.CampusId.Value;
            }
        }

        // ============================================================
        // 3) CAMPUS ADMIN
        // ============================================================
        else if (_tenant.Role == UserRole.CampusAdmin)
        {
            if (dto.Role is UserRole.Teacher or UserRole.Student)
            {
                user.TenantId = _tenant.TenantId;
                user.CampusId = _tenant.CampusId;
            }
            else
            {
                throw new UnauthorizedAccessException("CampusAdmin can only create Teacher/Student.");
            }
        }

        else
        {
            throw new UnauthorizedAccessException("You are not allowed to create users.");
        }

        var created = await _write.AddAsync(user);
        return await _read.GetByIdAsync(created.Id)
               ?? throw new Exception("Read failed after creation");
    }
}

