using Application.DTO.Academic;

namespace Application.Interfaces.Academic;
public interface IStudentReadRepository
    {
        Task<IEnumerable<StudentDto>> GetByClassSectionAsync(Guid classId, Guid sectionId);
        Task<IEnumerable<StudentDto>> GetByCampusAsync(Guid campusId);
    }