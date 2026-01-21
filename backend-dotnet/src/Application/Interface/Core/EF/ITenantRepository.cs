using Domain.Core.Entities;

namespace Infrastructure.Data.Repository.EF.Core.Interface;

public interface ITenantRepository
{
    Task<Tenant> AddAsync(Tenant entity);
    Task<Tenant?> GetByIdAsync(Guid id);
    Task UpdateAsync(Tenant entity);
    Task SoftDeleteAsync(Guid id);
    Task<List<Tenant>> GetAllAsync();
}

