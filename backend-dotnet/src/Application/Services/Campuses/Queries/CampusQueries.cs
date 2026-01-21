using Application.DTO.Core;
using MediatR;

namespace Application.Services.Campuses.Queries;

public record GetCampusByIdQuery(Guid CampusId, Guid? TenantId = null) : IRequest<CampusDto>;
public record GetCampusesByTenantQuery(Guid TenantId) : IRequest<List<CampusDto>>;
public record GetAllCampusesQuery() : IRequest<List<CampusDto>>; // tenant scoped through ITenantContext
