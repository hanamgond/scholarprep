namespace Application.DTO.Core;

public record CampusDto(
    Guid Id,
    Guid TenantId,
    string Name,
    string Address,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    Guid CreatedBy,
    Guid? UpdatedBy
);

