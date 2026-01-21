using MediatR;

namespace Application.Services.Enrollment.Commands;

public record DeleteEnrollmentCommand(Guid EnrollmentId) : IRequest<bool>;