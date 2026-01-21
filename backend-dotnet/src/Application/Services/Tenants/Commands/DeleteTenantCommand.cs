using MediatR;

namespace Application.Services.Tenants.Commands;

public record DeleteTenantCommand(Guid TenantId) : IRequest<bool>;