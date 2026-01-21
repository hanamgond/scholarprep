using Application.DTO.Academic;

namespace Application.Interfaces.Academic;

public interface IClassReadRepository
{
    Task<ClassDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<ClassDto>> GetByCampusAsync(Guid campusId);
    Task<IEnumerable<ClassDto>> GetByTenantAsync(Guid tenantId);
    Task<IEnumerable<ClassDto>> GetAllAsync(Guid tenantId);
}
