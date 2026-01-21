using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Sections.Queries;

public record GetSectionsByClassQuery(Guid ClassId) : IRequest<List<SectionDto>>;

