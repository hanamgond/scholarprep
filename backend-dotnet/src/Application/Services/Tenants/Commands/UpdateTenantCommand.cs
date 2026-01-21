using Application.DTO.Core;
using MediatR;

namespace Application.Services.Tenants.Commands;

public record UpdateTenantCommand(Guid TenantId, UpdateTenantDto Dto) : IRequest<TenantDto>;