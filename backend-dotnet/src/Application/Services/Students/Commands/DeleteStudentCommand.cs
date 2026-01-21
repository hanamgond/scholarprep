
using MediatR;

namespace Application.Services.Students.Commands;

public record DeleteStudentCommand(Guid StudentId) : IRequest<bool>;

