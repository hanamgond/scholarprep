
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Queries;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Students.Handlers;

public class GetStudentsByCampusHandler
    : IRequestHandler<GetStudentsByCampusQuery, List<StudentDto>>
{
    private readonly IStudentReadRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetStudentsByCampusHandler(IStudentReadRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<List<StudentDto>> Handle(GetStudentsByCampusQuery request, CancellationToken cancellationToken)
    {
        // Campus admin cannot request other campuses
        if (_tenant.Role == UserRole.CampusAdmin && request.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Access denied.");

        var list = await _repo.GetByCampusAsync(request.CampusId);

        return list.Select(s => _mapper.Map<StudentDto>(s)).ToList();
    }
}
