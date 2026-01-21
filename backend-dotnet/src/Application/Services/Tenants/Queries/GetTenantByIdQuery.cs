using Application.DTO.Core;
using MediatR;

namespace Application.Services.Tenants.Queries;

public record GetTenantByIdQuery(Guid TenantId) : IRequest<TenantDto>;