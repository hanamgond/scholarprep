
using Domain.Enums.Core;

namespace Application.DTO.Core;

public record CreateUserDto(
    Guid CampusId,      // where this user belongs (TenantAdmin may set)
    string Email,
    string Password,    // plain; handler will hash
    string FirstName,
    string LastName,
    UserRole Role,
    bool IsActive = true
);