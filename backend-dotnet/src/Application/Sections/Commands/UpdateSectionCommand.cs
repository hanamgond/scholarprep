using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Classes.DTOs; // We re-use SectionDto
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Application.Sections.Commands;

public record UpdateSectionCommand : IRequest<SectionDto>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
}

public class UpdateSectionCommandHandler : IRequestHandler<UpdateSectionCommand, SectionDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public UpdateSectionCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<SectionDto> Handle(UpdateSectionCommand request, CancellationToken cancellationToken)
    {
        // 1. Find the section
        var sectionToUpdate = await _context.Sections
            .Where(s => s.TenantId == _tenantContext.TenantId && s.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (sectionToUpdate == null)
        {
            throw new InvalidOperationException("Section not found.");
        }

        // 2. Update the name
        sectionToUpdate.Name = request.Name;
        await _context.SaveChangesAsync(cancellationToken);

        // 3. Return the updated DTO
        return new SectionDto
        {
            Id = sectionToUpdate.Id,
            Name = sectionToUpdate.Name
        };
    }
}