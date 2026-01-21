using Domain.Academic.Entities;

namespace Application.Interfaces.Academic;

public interface IEnrollmentRepository
{
    Task<Enrollment> AddAsync(Enrollment entity);
    Task<Enrollment?> GetByIdAsync(Guid id);
    Task UpdateAsync(Enrollment entity);
    Task SoftDeleteAsync(Guid id);
    Task HardDeleteAsync(Guid id); // optional
    Task<List<Enrollment>> GetByStudentAsync(Guid studentId);
}
