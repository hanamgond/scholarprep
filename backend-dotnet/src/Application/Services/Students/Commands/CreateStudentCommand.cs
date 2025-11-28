using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Students.Commands;

public record CreateStudentCommand(CreateStudentDto Dto) : IRequest<StudentDto>;
