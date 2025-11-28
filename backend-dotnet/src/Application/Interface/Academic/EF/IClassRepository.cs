using Domain.Academic.Entities;

namespace Application.Interfaces.Academic;

public interface IClassRepository
{
    Task<Class> AddAsync(Class entity);
    Task<Class?> GetByIdAsync(Guid id);
    Task<List<Class>> GetByCampusAsync(Guid campusId);
    Task<List<Class>> GetByTenantAsync(Guid tenantId);
    Task<List<Class>> GetAllAsync(Guid tenantId);
    Task UpdateAsync(Class entity);
    Task SoftDeleteAsync(Guid id);
    Task HardDeleteAsync(Guid id);
}
