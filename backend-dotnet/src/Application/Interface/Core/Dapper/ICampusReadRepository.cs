using Application.DTO.Core;

namespace Infrastructure.Data.Repository.Dapper.Core.Interface;

public interface ICampusReadRepository
{
    Task<CampusDto?> GetByIdAsync(Guid id, Guid? tenantId = null);
    Task<IEnumerable<CampusDto>> GetByTenantAsync(Guid tenantId);
    Task<IEnumerable<CampusDto>> GetAllAsync(Guid tenantId);
}

