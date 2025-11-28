using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Sections.Queries;

public record GetSectionByIdQuery(Guid SectionId) : IRequest<SectionDto>;
