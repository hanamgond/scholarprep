using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Queries;

public record GetEnrollmentsByStudentQuery(Guid StudentId) : IRequest<List<EnrollmentDto>>;
