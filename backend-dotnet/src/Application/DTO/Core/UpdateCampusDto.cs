namespace Application.DTO.Core;
public record UpdateCampusDto(    
    string Name,
    string Address,
    bool IsActive,
    Guid? TenantId = null // required when SuperAdmin updates campus
);
