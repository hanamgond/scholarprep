using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Queries;

public record GetEnrollmentsByClassQuery(Guid ClassId) : IRequest<List<EnrollmentDto>>;
