using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Students.Queries;
using AutoMapper;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Students.Handlers;

public class GetStudentsByClassSectionHandler
    : IRequestHandler<GetStudentsByClassSectionQuery, List<StudentDto>>
{
    private readonly IStudentReadRepository readRepo;
    private readonly ITenantContext _tenant;
    private readonly IMapper _mapper;

    public GetStudentsByClassSectionHandler(IStudentReadRepository readRepo, ITenantContext tenant, IMapper mapper)
    {
        this.readRepo = readRepo;
        _tenant = tenant;
        _mapper = mapper;
    }

    public async Task<List<StudentDto>> Handle(GetStudentsByClassSectionQuery request, CancellationToken cancellationToken)
    {
        var list = await readRepo.GetByClassSectionAsync(request.ClassId, request.SectionId);

        if (_tenant.Role == UserRole.CampusAdmin)
            list = list.Where(s => s.CampusId == _tenant.CampusId).ToList();

        return list.Select(s => _mapper.Map<StudentDto>(s)).ToList();
    }
}
