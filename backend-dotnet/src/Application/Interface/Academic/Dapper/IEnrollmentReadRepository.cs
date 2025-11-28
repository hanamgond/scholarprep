using Application.DTO.Academic;

namespace Application.Interfaces.Academic;

public interface IEnrollmentReadRepository
{
    Task<EnrollmentDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<EnrollmentDto>> GetByStudentAsync(Guid studentId);
    Task<IEnumerable<EnrollmentDto>> GetByClassAsync(Guid classId);
    Task<IEnumerable<EnrollmentDto>> GetByCampusAsync(Guid campusId);
    Task<IEnumerable<EnrollmentDto>> GetAllAsync(Guid tenantId);
}
