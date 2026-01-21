
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Sections.Commands;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Sections.Handlers;

public class UpdateSectionHandler : IRequestHandler<UpdateSectionCommand, SectionDto>
{
    private readonly ISectionRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public UpdateSectionHandler(ISectionRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<SectionDto> Handle(UpdateSectionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.SectionId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Section not found.");

        switch (_tenant.Role)
        {
            case UserRole.SuperAdmin:
            case UserRole.TenantAdmin:
                break; // full access

            case UserRole.CampusAdmin:
                if (entity.CampusId != _tenant.CampusId)
                    throw new UnauthorizedAccessException("Campus admin cannot update sections from another campus.");
                break;

            default:
                throw new UnauthorizedAccessException("You are not allowed to update a section.");
        }

        entity.Name = request.Dto.Name;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        await _repo.UpdateAsync(entity);

        return _mapper.Map<SectionDto>(entity);
    }
}
