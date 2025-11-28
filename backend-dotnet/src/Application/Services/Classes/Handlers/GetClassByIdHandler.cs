
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Classes.Queries;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Classes.Handlers;

public class GetClassByIdHandler : IRequestHandler<GetClassByIdQuery, ClassDto>
{
    private readonly IClassReadRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetClassByIdHandler(IClassReadRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<ClassDto> Handle(GetClassByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.ClassId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Class not found.");

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Access denied.");

        return _mapper.Map<ClassDto>(entity);
    }
}
