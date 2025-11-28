
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Sections.Commands;
using AutoMapper;
using Domain.Academic.Entities;
using MediatR;

namespace Application.Services.Sections.Handlers;

public class CreateSectionHandler : IRequestHandler<CreateSectionCommand, SectionDto>
{
    private readonly ISectionRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public CreateSectionHandler(ISectionRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<SectionDto> Handle(CreateSectionCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        var entity = new Section
        {
            Name = dto.Name,
            ClassId = dto.ClassId,
            CampusId = _tenant.CampusId,
            TenantId = _tenant.TenantId,
            CreatedBy = _tenant.UserId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repo.AddAsync(entity);
        return _mapper.Map<SectionDto>(created);
    }
}
