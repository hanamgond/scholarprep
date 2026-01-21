namespace Application.DTO.Academic;
public record EnrollmentDto(
    Guid Id,
    Guid TenantId,
    Guid CampusId,
    Guid StudentId,
    Guid ClassId,
    Guid SectionId,
    DateTime EnrolledAt,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    Guid CreatedBy,
    Guid? UpdatedBy
);
