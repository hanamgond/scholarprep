
using Application.Interface;
using Domain.Academic.Entities;
using Domain.Core.Entities;
using Domain.Enums.Core;

namespace Application.DTO.Core;
//Notes:

//For SuperAdmin creating TenantAdmin: TenantId must be sent; CampusId ignored.
//For TenantAdmin creating CampusAdmin: CampusId required, TenantId ignored.
//For CampusAdmin creating Teacher/Student: CampusId auto = tenantContext.CampusId.
public record CreateUserDto(
    Guid? TenantId,
    Guid? CampusId,      // where this user belongs (TenantAdmin may set)
    string Email,
    string Password,    // plain; handler will hash
    string FirstName,
    string LastName,
    UserRole Role,
    bool IsActive = true
);