using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Classes.Commands;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;


namespace Application.Services.Classes.Handlers;
public class UpdateClassHandler : IRequestHandler<UpdateClassCommand, ClassDto>
{
    private readonly IClassRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public UpdateClassHandler(IClassRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<ClassDto> Handle(UpdateClassCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.ClassId);
        if (entity == null || entity.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Class not found.");

        // Role-based control
        var userRole = _tenant.Role; // How you store current user role from claims

        if (userRole == UserRole.CampusAdmin)
        {
            // Campus admin must match campus
            if (entity.CampusId != _tenant.CampusId)
                throw new UnauthorizedAccessException("Not allowed to update classes in other campuses.");
        }
        else if (userRole == UserRole.TenantAdmin)
        {
            // Tenant admin can update anything under the tenant → no campus restriction
        }
        else if (userRole == UserRole.SuperAdmin)
        {
            // SuperAdmin → no restriction
        }
        else
        {
            throw new UnauthorizedAccessException("You do not have permission to update classes.");
        }

        // Update values
        entity.Name = request.Dto.Name;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        await _repo.UpdateAsync(entity);

        return _mapper.Map<ClassDto>(entity);
    }

}

