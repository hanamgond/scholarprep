using Application.DTO.Academic;
using MediatR;

namespace Application.Services.Classes.Commands;

public record CreateClassCommand(CreateClassDto Dto) : IRequest<ClassDto>;

