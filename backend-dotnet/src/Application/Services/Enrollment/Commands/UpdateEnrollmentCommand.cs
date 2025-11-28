using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Commands;

public record UpdateEnrollmentCommand(Guid EnrollmentId, UpdateEnrollmentDto Dto) : IRequest<EnrollmentDto>;