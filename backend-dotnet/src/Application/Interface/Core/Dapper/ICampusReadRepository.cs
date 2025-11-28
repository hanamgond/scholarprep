using Application.DTO.Core;

namespace Infrastructure.Data.Repository.Dapper.Core.Interface;

public interface ICampusReadRepository
{
    Task<IEnumerable<CampusDto>> GetByTenantAsync(Guid tenantId);
}

