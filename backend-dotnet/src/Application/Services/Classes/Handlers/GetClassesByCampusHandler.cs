
using Application.DTO.Academic;
using Application.Interface;
using Application.Services.Classes.Queries;
using Domain.Enums.Core;
using MediatR;
using Application.Interfaces.Academic;

namespace Application.Services.Classes.Handlers;

public class GetClassesByCampusHandler : IRequestHandler<GetClassesByCampusQuery, List<ClassDto>>
{
    private readonly IClassReadRepository _readRepo;
    private readonly ITenantContext _tenant;

    public GetClassesByCampusHandler(IClassReadRepository readRepo, ITenantContext tenant)
    {
        _readRepo = readRepo;
        _tenant = tenant;
    }

    public async Task<List<ClassDto>> Handle(GetClassesByCampusQuery request, CancellationToken cancellationToken)
    {
        // permission: campus admin cannot request other campuses
        if (_tenant.Role == UserRole.CampusAdmin && request.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Access denied.");

        var list = await _readRepo.GetByCampusAsync(request.CampusId);
        return list.ToList();
    }
}
