
namespace Application.DTO.Academic;

public record ClassDto(
    Guid Id,
    Guid TenantId,
    Guid CampusId,
    string Name,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    Guid CreatedBy,
    Guid? UpdatedBy
);

