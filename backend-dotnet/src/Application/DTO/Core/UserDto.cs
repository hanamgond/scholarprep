    
namespace Application.DTO.Core;

public record UserDto(
    Guid Id,
    Guid TenantId,
    Guid CampusId,
    string Email,
    string FirstName,
    string LastName,
    string Role,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    Guid CreatedBy,
    Guid? UpdatedBy
);

