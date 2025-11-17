using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Classes.DTOs;
using ScholarPrep.Shared.Interfaces;
using System.Collections.Generic; // Make sure this is included
using System.Linq; // Make sure this is included
using System.Threading; // Make sure this is included
using System.Threading.Tasks; // Make sure this is included

namespace ScholarPrep.Application.Classes.Queries;

public record GetClassesQuery : IRequest<List<ClassDto>>;

public class GetClassesQueryHandler : IRequestHandler<GetClassesQuery, List<ClassDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetClassesQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<List<ClassDto>> Handle(GetClassesQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _tenantContext.TenantId;
        
        var classes = await _context.Classes
            .Where(c => c.TenantId == tenantId)
            .Include(c => c.Sections) // Join with Sections
            .Include(c => c.Enrollments) // Join with Enrollments
            .OrderBy(c => c.Name) 
            .Select(c => new ClassDto
            {
                Id = c.Id,
                Name = c.Name,
                // Calculate student count
                StudentCount = c.Enrollments.Count(), 
                // Placeholder for avgAccuracy
                AvgAccuracy = 0, 
                // Map sections
                Sections = c.Sections.Select(s => new SectionDto
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToList()
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);
            
        return classes;
    }
}