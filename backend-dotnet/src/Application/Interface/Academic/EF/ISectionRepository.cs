using Domain.Academic.Entities;

namespace Application.Interfaces.Academic;

public interface ISectionRepository
{
    Task<Section> AddAsync(Section entity);
    Task<Section?> GetByIdAsync(Guid id);
    Task<List<Section>> GetByClassAsync(Guid classId);

    Task UpdateAsync(Section entity);

    Task SoftDeleteAsync(Guid id);  // recommended
    Task HardDeleteAsync(Guid id);  // optional
}

