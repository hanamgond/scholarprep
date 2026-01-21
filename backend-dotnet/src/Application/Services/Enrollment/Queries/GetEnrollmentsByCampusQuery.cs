using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Enrollment.Queries;

public record GetEnrollmentsByCampusQuery(Guid CampusId) : IRequest<List<EnrollmentDto>>;
