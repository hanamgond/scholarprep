using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Classes.Queries;

public record GetAllClassesQuery() : IRequest<List<ClassDto>>; // tenant-scoped