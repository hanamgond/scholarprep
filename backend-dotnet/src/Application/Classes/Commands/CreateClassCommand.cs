using MediatR;
using ScholarPrep.Application.Classes.DTOs;
using ScholarPrep.Domain.Entities;
using ScholarPrep.Shared.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ScholarPrep.Application.Classes.Commands;

public record CreateClassCommand : IRequest<ClassDto>
{
    public string Name { get; init; } = string.Empty;
}

public class CreateClassCommandHandler : IRequestHandler<CreateClassCommand, ClassDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CreateClassCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<ClassDto> Handle(CreateClassCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _tenantContext.TenantId;
        var tenantName = _tenantContext.TenantName ?? "Main"; 

        // 1. Check if the Tenant exists
        var tenant = await _context.Tenants
            .Where(t => t.Id == tenantId)
            .FirstOrDefaultAsync(cancellationToken);

        // 2. If the Tenant does NOT exist, create it
        if (tenant == null)
        {
            tenant = new Tenant
            {
                Id = tenantId,
                Name = tenantName,
                // Add any other required Tenant properties
            };
            _context.Tenants.Add(tenant);
            // DO NOT SAVE YET
        }

        // 3. Find the campus
        var campus = await _context.Campuses
            .Where(c => c.TenantId == tenantId)
            .FirstOrDefaultAsync(cancellationToken);

        // 4. If no campus exists, create a default one
        if (campus == null)
        {
            campus = new Campus
            {
                Name = $"{tenantName} Campus",
                // 5. THIS IS THE FIX: Link the 'Tenant' object directly
                Tenant = tenant 
            };
            _context.Campuses.Add(campus);
            // DO NOT SAVE YET
        }

        // 6. Create the new class
        var newClass = new Class
        {
            Name = request.Name,
            // 7. THIS IS THE FIX: Link the objects, not the IDs
            Tenant = tenant,
            Campus = campus 
        };

        _context.Classes.Add(newClass);
        
        // 8. NOW save everything.
        // EF Core will see the relationships and save in the correct order:
        // 1. Tenant, 2. Campus, 3. Class
        await _context.SaveChangesAsync(cancellationToken); 

        // 9. Return the DTO
        return new ClassDto
        {
            Id = newClass.Id,
            Name = newClass.Name,
            StudentCount = 0,
            AvgAccuracy = 0,
            Sections = new List<SectionDto>()
        };
    }
}