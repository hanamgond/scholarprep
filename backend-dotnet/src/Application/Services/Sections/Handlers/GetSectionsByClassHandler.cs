
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Sections.Queries;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Sections.Handlers;

public class GetSectionsByClassHandler : IRequestHandler<GetSectionsByClassQuery, List<SectionDto>>
{
    private readonly ISectionRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetSectionsByClassHandler(ISectionRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<List<SectionDto>> Handle(GetSectionsByClassQuery request, CancellationToken cancellationToken)
    {
        var sections = await _repo.GetByClassAsync(request.ClassId);

        // CampusAdmin restriction:
        if (_tenant.Role == UserRole.CampusAdmin)
            sections = sections.Where(x => x.CampusId == _tenant.CampusId).ToList();

        return sections.Select(s => _mapper.Map<SectionDto>(s)).ToList();
    }
}
