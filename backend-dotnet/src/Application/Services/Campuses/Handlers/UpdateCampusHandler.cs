using Application.DTO.Core;
using Application.Interface;
using Application.Services.Campuses.Commands;
using AutoMapper;
using Domain.Core.Entities;
using Domain.Enums.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;

namespace Application.Services.Campuses.Handlers;

public class UpdateCampusHandler : IRequestHandler<UpdateCampusCommand, CampusDto>
{
    private readonly ICampusRepository _repo;
    private readonly ICampusReadRepository _readRepo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public UpdateCampusHandler(ICampusRepository repo, ICampusReadRepository readRepo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _readRepo = readRepo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<CampusDto> Handle(UpdateCampusCommand request, CancellationToken ct)
    {
        if (_tenant.Role != UserRole.SuperAdmin && _tenant.Role != UserRole.TenantAdmin)
            throw new UnauthorizedAccessException("Only SuperAdmin or TenantAdmin can update campuses.");

        if(_tenant.Role == UserRole.SuperAdmin && request.Dto.TenantId is null)
            throw new UnauthorizedAccessException("SuperAdmin should Pass correct TenantId");

           var entity = await _repo.GetByIdAsync(request.CampusId, request.Dto.TenantId)
                         ?? throw new KeyNotFoundException("Campus not found.");

        if (entity.TenantId != _tenant.TenantId && _tenant.Role != UserRole.SuperAdmin)
            throw new UnauthorizedAccessException("Tenant mismatch.");

        // update fields
        entity.Name = request.Dto.Name;
        entity.Address = request.Dto.Address;
        entity.IsActive = request.Dto.IsActive;

        await _repo.UpdateAsync(entity);

        return await _readRepo.GetByIdAsync(entity.Id, entity.TenantId) ?? _mapper.Map<CampusDto>(entity);
    }
}
