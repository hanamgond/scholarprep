
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Sections.Commands;

public record UpdateSectionCommand(Guid SectionId, UpdateSectionDto Dto) : IRequest<SectionDto>;
