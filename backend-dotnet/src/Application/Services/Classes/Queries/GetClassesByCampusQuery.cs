
using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Classes.Queries;

public record GetClassesByCampusQuery(Guid CampusId) : IRequest<List<ClassDto>>;
