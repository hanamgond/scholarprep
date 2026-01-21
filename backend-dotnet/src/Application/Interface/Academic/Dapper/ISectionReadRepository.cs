using Application.DTO.Academic;

namespace Application.Interfaces.Academic;

    public interface ISectionReadRepository
    {
        Task<IEnumerable<SectionDto>> GetSectionsByClassAsync(Guid classId);
    }
