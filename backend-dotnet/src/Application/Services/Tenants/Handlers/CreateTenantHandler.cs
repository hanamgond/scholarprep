using Application.DTO.Core;
using Application.Interface;
using Application.Services.Tenants.Commands;
using Domain.Core.Entities;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Tenants.Handlers;

public class CreateTenantHandler : IRequestHandler<CreateTenantCommand, TenantDto>
{
    private readonly ITenantRepository _repo;
    private readonly ITenantReadRepository _read;
    private readonly ITenantContext _tenant;

    public CreateTenantHandler(ITenantRepository repo, ITenantReadRepository read, ITenantContext tenant)
    {
        _repo = repo;
        _read = read;
        _tenant = tenant;
    }

    public async Task<TenantDto> Handle(CreateTenantCommand request, CancellationToken ct)
    {
        if (_tenant.Role != UserRole.SuperAdmin)
            throw new UnauthorizedAccessException("Only SuperAdmin can create tenants.");

        var entity = new Tenant
        {
            Name = request.Dto.Name,
            IsActive = true
        };

        var created = await _repo.AddAsync(entity);
        return await _read.GetByIdAsync(created.Id)
               ?? throw new Exception("Failed to read tenant after creation.");
    }
}
