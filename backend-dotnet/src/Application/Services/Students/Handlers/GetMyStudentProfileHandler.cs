
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Queries;
using AutoMapper;
using MediatR;

namespace Application.Services.Students.Handlers;

public class GetMyStudentProfileHandler : IRequestHandler<GetMyStudentProfileQuery, StudentDto>
{
    private readonly IStudentRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetMyStudentProfileHandler(IStudentRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<StudentDto> Handle(GetMyStudentProfileQuery request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(_tenant.UserId);

        if (entity == null)
            throw new UnauthorizedAccessException("Student profile not found.");

        // Student cannot access other campus by changing token manually
        if (entity.CampusId != _tenant.CampusId || entity.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException("Access denied.");

        return _mapper.Map<StudentDto>(entity);
    }
}
