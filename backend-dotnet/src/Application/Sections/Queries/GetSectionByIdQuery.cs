using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Sections.DTOs;
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Application.Sections.Queries;

public record GetSectionByIdQuery(Guid Id) : IRequest<SectionDetailsDto?>;

public class GetSectionByIdQueryHandler : IRequestHandler<GetSectionByIdQuery, SectionDetailsDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetSectionByIdQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<SectionDetailsDto?> Handle(GetSectionByIdQuery request, CancellationToken cancellationToken)
    {
        var section = await _context.Sections
            .Where(s => s.TenantId == _tenantContext.TenantId && s.Id == request.Id)
            .Include(s => s.Class) // Join with the parent Class
            .Select(s => new SectionDetailsDto
            {
                Id = s.Id,
                Name = s.Name,
                Class = new SectionDetailsDto.ClassInfo
                {
                    Id = s.Class.Id,
                    Name = s.Class.Name
                }
            })
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        return section;
    }
}