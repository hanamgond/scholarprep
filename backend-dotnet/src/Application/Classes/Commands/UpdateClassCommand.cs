using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Classes.DTOs; // We'll reuse the DTOs
using ScholarPrep.Shared.Interfaces;
using System.Linq; // Add this for .Select()

namespace ScholarPrep.Application.Classes.Commands;

public record UpdateClassCommand : IRequest<ClassDto>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
}

public class UpdateClassCommandHandler : IRequestHandler<UpdateClassCommand, ClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public UpdateClassCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<ClassDto> Handle(UpdateClassCommand request, CancellationToken cancellationToken)
    {
        // 1. Find the class, and include its related data for the DTO
        var classToUpdate = await _context.Classes
            .Where(c => c.TenantId == _tenantContext.TenantId && c.Id == request.Id)
            .Include(c => c.Sections) // Include sections for the return DTO
            .Include(c => c.Enrollments) // Include enrollments for the return DTO
            .FirstOrDefaultAsync(cancellationToken);

        if (classToUpdate == null)
        {
            throw new InvalidOperationException("Class not found.");
        }

        // 2. Update the name
        classToUpdate.Name = request.Name;
        await _context.SaveChangesAsync(cancellationToken);

        // 3. Return the full DTO, just like the GET request
        return new ClassDto
        {
            Id = classToUpdate.Id,
            Name = classToUpdate.Name,
            StudentCount = classToUpdate.Enrollments.Count,
            AvgAccuracy = 0, // Placeholder
            Sections = classToUpdate.Sections.Select(s => new SectionDto
            {
                Id = s.Id,
                Name = s.Name
            }).ToList()
        };
    }
}