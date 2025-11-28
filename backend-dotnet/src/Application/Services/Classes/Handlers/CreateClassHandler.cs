using Application.DTO.Academic;
using Application.Interface;
using Application.Services.Classes.Commands;
using AutoMapper;
using Domain.Academic.Entities;
using MediatR;
using Application.Interfaces.Academic;
using Domain.Enums.Core;

namespace Application.Services.Classes.Handlers;


public class CreateClassHandler : IRequestHandler<CreateClassCommand, ClassDto>
{
    private readonly IClassRepository _efRepo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public CreateClassHandler(IClassRepository efRepo, ITenantContext tenant, IMapper mapper)
    {
        _efRepo = efRepo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<ClassDto> Handle(CreateClassCommand request, CancellationToken cancellationToken)
    {
        // Permission: CampusAdmin can only create in their campus; TenantAdmin & SuperAdmin allowed
        if (_tenant.Role == UserRole.CampusAdmin && request.Dto.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Campus admin cannot create class in another campus.");

        // Ensure the tenant matches (tenantId will be set by repository)
        var entity = new Class
        {
            Name = request.Dto.Name,
            CampusId = request.Dto.CampusId,
            TenantId = _tenant.TenantId
        };

        var created = await _efRepo.AddAsync(entity);

        var dto = _mapper.Map<ClassDto>(created);
        return dto;
    }
}



