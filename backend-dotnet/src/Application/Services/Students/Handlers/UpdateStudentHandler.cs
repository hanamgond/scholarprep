
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Commands;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Students.Handlers;

public class UpdateStudentHandler : IRequestHandler<UpdateStudentCommand, StudentDto>
{
    private readonly IStudentRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public UpdateStudentHandler(IStudentRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<StudentDto> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repo.GetByIdAsync(request.StudentId);

        if (entity == null || entity.TenantId != _tenant.TenantId)
            throw new KeyNotFoundException("Student not found.");

        // Role check
        if (_tenant.Role == UserRole.CampusAdmin && entity.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Campus admin cannot update students of another campus.");

        _mapper.Map(request.Dto, entity);

        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        await _repo.UpdateAsync(entity);

        return _mapper.Map<StudentDto>(entity);
    }
}
