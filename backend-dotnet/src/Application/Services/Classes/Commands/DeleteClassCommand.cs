using MediatR;

namespace Application.Services.Classes.Commands;

public record DeleteClassCommand(Guid ClassId) : IRequest<bool>;

