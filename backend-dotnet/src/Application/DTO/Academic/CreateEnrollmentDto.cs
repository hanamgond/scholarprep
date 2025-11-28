
namespace Application.DTO.Academic;

public record CreateEnrollmentDto(
    Guid StudentId,
    Guid ClassId,
    Guid SectionId
);
