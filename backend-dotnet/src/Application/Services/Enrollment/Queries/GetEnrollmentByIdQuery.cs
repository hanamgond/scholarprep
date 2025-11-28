using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Queries;

public record GetEnrollmentByIdQuery(Guid EnrollmentId) : IRequest<EnrollmentDto>;
