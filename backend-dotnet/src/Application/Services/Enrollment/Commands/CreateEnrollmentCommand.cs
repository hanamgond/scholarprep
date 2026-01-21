using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Commands;
public record CreateEnrollmentCommand(CreateEnrollmentDto Dto) : IRequest<EnrollmentDto>;
