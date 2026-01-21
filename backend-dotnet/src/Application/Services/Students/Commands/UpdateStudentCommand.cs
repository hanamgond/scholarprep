
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Students.Commands;

public record UpdateStudentCommand(Guid StudentId, UpdateStudentDto Dto) : IRequest<StudentDto>;
