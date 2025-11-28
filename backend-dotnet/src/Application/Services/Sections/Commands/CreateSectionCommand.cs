using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Sections.Commands;

public record CreateSectionCommand(CreateSectionDto Dto) : IRequest<SectionDto>;
