namespace Application.DTO.Core;
public record CreateCampusDto(
    Guid? TenantId,       // required when SuperAdmin creates campus
    string Name,
    string Address
);