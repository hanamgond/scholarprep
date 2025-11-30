using Application.DTO.Core;
using MediatR;

namespace Application.Services.Campuses.Commands;

public record CreateCampusCommand(CreateCampusDto Dto) : IRequest<CampusDto>;
public record UpdateCampusCommand(Guid CampusId, UpdateCampusDto Dto) : IRequest<CampusDto>;
public record DeleteCampusCommand(Guid CampusId) : IRequest<bool>;
