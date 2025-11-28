using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Queries;

public record GetAllEnrollmentsQuery() : IRequest<List<EnrollmentDto>>;
