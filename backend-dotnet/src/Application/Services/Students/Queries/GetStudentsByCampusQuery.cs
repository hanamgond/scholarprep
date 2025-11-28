
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Students.Queries;

public record GetStudentsByCampusQuery(Guid CampusId) : IRequest<List<StudentDto>>;

