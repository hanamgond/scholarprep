using Application.DTO.Core;
using Application.Interface;
using Application.Services.Tenants.Commands;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Tenants.Handlers;

public class UpdateTenantHandler : IRequestHandler<UpdateTenantCommand, TenantDto>
{
    private readonly ITenantRepository _repo;
    private readonly ITenantReadRepository _read;
    private readonly ITenantContext _tenant;

    public UpdateTenantHandler(ITenantRepository repo, ITenantReadRepository read, ITenantContext tenant)
    {
        _repo = repo;
        _read = read;
        _tenant = tenant;
    }

    public async Task<TenantDto> Handle(UpdateTenantCommand request, CancellationToken ct)
    {
        if (_tenant.Role != UserRole.SuperAdmin)
            throw new UnauthorizedAccessException();

        var entity = await _repo.GetByIdAsync(request.TenantId)
                     ?? throw new KeyNotFoundException("Tenant not found.");

        entity.Name = request.Dto.Name;
        entity.IsActive = request.Dto.IsActive;

        await _repo.UpdateAsync(entity);

        return await _read.GetByIdAsync(entity.Id)
               ?? throw new Exception("Failed to retrieve updated tenant.");
    }
}
