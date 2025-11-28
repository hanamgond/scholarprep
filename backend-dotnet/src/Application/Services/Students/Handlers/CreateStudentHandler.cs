
using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Commands;
using AutoMapper;
using Domain.Academic.Entities;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Students.Handlers;

public class CreateStudentHandler : IRequestHandler<CreateStudentCommand, StudentDto>
{
    private readonly IStudentRepository _repo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public CreateStudentHandler(IStudentRepository repo, ITenantContext tenant, IMapper mapper)
    {
        _repo = repo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<StudentDto> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;

        // Campus Admin cannot create student in another campus
        if (_tenant.Role == UserRole.CampusAdmin &&
            _tenant.CampusId != _tenant.CampusId)
        {
            throw new UnauthorizedAccessException("Campus admin cannot add students to another campus.");
        }

        var entity = _mapper.Map<Student>(dto);

        entity.TenantId = _tenant.TenantId;
        entity.CampusId = _tenant.CampusId;
        entity.CreatedBy = _tenant.UserId;
        entity.CreatedAt = DateTime.UtcNow;

        var added = await _repo.AddAsync(entity);

        return _mapper.Map<StudentDto>(added);
    }
}
