using Application.DTO.Core;
using MediatR;

namespace Application.Services.Tenants.Commands;

public record CreateTenantCommand(CreateTenantDto Dto) : IRequest<TenantDto>;