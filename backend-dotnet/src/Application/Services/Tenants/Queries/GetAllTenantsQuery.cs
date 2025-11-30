using Application.DTO.Core;
using MediatR;

namespace Application.Services.Tenants.Queries;

public record GetAllTenantsQuery() : IRequest<List<TenantDto>>;