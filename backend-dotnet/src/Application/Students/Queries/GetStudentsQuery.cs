using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Students.DTOs;
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Application.Students.Queries;

public record GetStudentsQuery : IRequest<List<StudentDto>>;

public class GetStudentsQueryHandler : IRequestHandler<GetStudentsQuery, List<StudentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetStudentsQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<List<StudentDto>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Students
            .Where(s => s.TenantId == _tenantContext.TenantId)
            .Include(s => s.Campus)
            .OrderBy(s => s.LastName)
            .ThenBy(s => s.FirstName)
            .Select(s => new StudentDto
            {
                Id = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                AdmissionNo = s.AdmissionNo,
                Email = s.Email,
                Phone = s.Phone,
                DateOfBirth = s.DateOfBirth,
                CampusId = s.CampusId,
                CampusName = s.Campus.Name,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
