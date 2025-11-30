namespace Application.DTO.Core;

public record UpdateTenantDto(
    string Name,
    bool IsActive
);