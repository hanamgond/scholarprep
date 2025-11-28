
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Queries;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Students.Handlers;

public class GetStudentByIdHandler : IRequestHandler<GetStudentByIdQuery, StudentDto>
{
    private readonly IStudentRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetStudentByIdHandler(IStudentRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<StudentDto> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.StudentId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Student not found.");

        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Not allowed.");

        return _mapper.Map<StudentDto>(entity);
    }
}
