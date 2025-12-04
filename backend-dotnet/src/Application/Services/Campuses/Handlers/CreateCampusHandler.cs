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

public class CreateCampusHandler : IRequestHandler<CreateCampusCommand, CampusDto>
{
    private readonly ICampusRepository _repo;
    private readonly ICampusReadRepository _readRepo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public CreateCampusHandler(
        ICampusRepository repo,
        ICampusReadRepository readRepo,
        ITenantContext tenant,
        IMapper mapper)
    {
        _repo = repo;
        _readRepo = readRepo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<CampusDto> Handle(CreateCampusCommand request, CancellationToken ct)
    {
        var dto = request.Dto;
        var entity = new Campus();

        // SUPERADMIN — can create campus for any tenant
        if (_tenant.Role == UserRole.SuperAdmin)
        {
            if (dto.TenantId is null)
                throw new Exception("TenantId is required to create campus.");

            entity.TenantId = dto.TenantId.Value;
        }
        // TENANTADMIN — can create campus only for their tenant
        else if (_tenant.Role == UserRole.TenantAdmin)
        {
            if(dto.TenantId is not null && dto.TenantId != _tenant.TenantId)
                throw new UnauthorizedAccessException("Campus creation is allowed only for same tenant");
            else
                entity.TenantId = _tenant.TenantId;

        }
        else
        {
            throw new UnauthorizedAccessException("Campus creation is allowed only for SuperAdmin or TenantAdmin.");
        }

        entity.Name = dto.Name;
        entity.Address = dto.Address;
        entity.IsActive = true;

        var created = await _repo.AddAsync(entity);
        var campusDto = await _readRepo.GetByIdAsync(created.Id, entity.TenantId);
        return campusDto ?? _mapper.Map<CampusDto>(created);
    }
}
