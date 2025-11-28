
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Sections.Queries;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Sections.Handlers;

public class GetSectionByIdHandler : IRequestHandler<GetSectionByIdQuery, SectionDto>
{
    private readonly ISectionRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetSectionByIdHandler(ISectionRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<SectionDto> Handle(GetSectionByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.SectionId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Section not found.");

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Access denied.");

        return _mapper.Map<SectionDto>(entity);
    }
}
