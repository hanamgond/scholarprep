namespace Application.DTO.Academic;
public record SectionDto(
    Guid Id,
    Guid TenantId,
    Guid CampusId,
    Guid ClassId,
    string Name,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    Guid CreatedBy,
    Guid? UpdatedBy
);
