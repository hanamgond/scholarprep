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
        if (_tenant.Role != UserRole.SuperAdmin && _tenant.Role != UserRole.TenantAdmin)
            throw new UnauthorizedAccessException("Only SuperAdmin or TenantAdmin can create campuses.");

        // ensure tenant context matches (tenantId is set by repo)
        var entity = new Campus
        {
            TenantId = _tenant.TenantId,
            Name = request.Dto.Name,
            Address = request.Dto.Address,
            IsActive = true
        };

        var created = await _repo.AddAsync(entity);
        var dto = await _readRepo.GetByIdAsync(created.Id);
        return dto ?? _mapper.Map<CampusDto>(created);
    }
}
