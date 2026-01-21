
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Students.Queries;

public record GetMyStudentProfileQuery() : IRequest<StudentDto>;
