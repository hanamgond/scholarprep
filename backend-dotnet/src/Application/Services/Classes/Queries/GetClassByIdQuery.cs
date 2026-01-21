
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Classes.Queries;

public record GetClassByIdQuery(Guid ClassId) : IRequest<ClassDto>;

