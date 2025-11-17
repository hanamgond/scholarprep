using MediatR;
using ScholarPrep.Application.Classes.DTOs; // We'll re-use the SectionDto
using ScholarPrep.Domain.Entities;
using ScholarPrep.Shared.Interfaces;
using System.Text.Json.Serialization; // Required for mapping

namespace ScholarPrep.Application.Sections.Commands;

// This record matches the 'payload' from your handleAddSection function
public record CreateSectionCommand : IRequest<SectionDto>
{
    public string Name { get; init; } = string.Empty;

    // This attribute maps the JSON "class_id" to the C# "ClassId"
    [JsonPropertyName("class_id")]
    public Guid ClassId { get; init; }
    
    // We don't need tenant_id, the context will handle it
}

public class CreateSectionCommandHandler : IRequestHandler<CreateSectionCommand, SectionDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CreateSectionCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<SectionDto> Handle(CreateSectionCommand request, CancellationToken cancellationToken)
    {
        // Check if the parent class exists and belongs to this tenant
        var parentClass = await _context.Classes
            .FindAsync(new object[] { request.ClassId }, cancellationToken);

        if (parentClass == null || parentClass.TenantId != _tenantContext.TenantId)
        {
            throw new InvalidOperationException("Class not found.");
        }

        var newSection = new Section
        {
            Name = request.Name,
            ClassId = request.ClassId,
            TenantId = _tenantContext.TenantId
        };

        _context.Sections.Add(newSection);
        await _context.SaveChangesAsync(cancellationToken);

        // Return the DTO shape the frontend expects
        return new SectionDto
        {
            Id = newSection.Id,
            Name = newSection.Name
        };
    }
}