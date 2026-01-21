using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Classes.Commands;
public record UpdateClassCommand(Guid ClassId, UpdateClassDto Dto) : IRequest<ClassDto>;





