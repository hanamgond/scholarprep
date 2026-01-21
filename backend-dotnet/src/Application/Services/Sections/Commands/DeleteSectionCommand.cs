
using MediatR;

namespace Application.Services.Sections.Commands;

public record DeleteSectionCommand(Guid SectionId) : IRequest<bool>;
