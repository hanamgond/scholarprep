
namespace Application.DTO.Academic;

public record UpdateEnrollmentDto(
    Guid ClassId,
    Guid SectionId,
    bool IsActive
);
