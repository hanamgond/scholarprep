
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Students.Queries;

public record GetStudentByIdQuery(Guid StudentId) : IRequest<StudentDto>;
