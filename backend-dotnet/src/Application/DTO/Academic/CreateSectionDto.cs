namespace Application.DTO.Academic;
public record CreateSectionDto(
    string Name,
    Guid ClassId
);
