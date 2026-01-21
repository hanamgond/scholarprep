
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Students.Queries;

public record GetStudentsByClassSectionQuery(Guid ClassId, Guid SectionId)
    : IRequest<List<StudentDto>>;

