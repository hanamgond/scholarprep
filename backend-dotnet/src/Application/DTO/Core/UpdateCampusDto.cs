namespace Application.DTO.Core;
public record UpdateCampusDto(
    string Name,
    string Address,
    bool IsActive
);
