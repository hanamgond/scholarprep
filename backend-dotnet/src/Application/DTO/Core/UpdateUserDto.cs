using Domain.Enums.Core;

namespace Application.DTO.Core;

public record UpdateUserDto(
    string? FirstName,
    string? LastName,
    Guid? CampusId,     // optional; move user between campuses (admin-only)
    bool? IsActive,
    UserRole? Role      // admin-only
);