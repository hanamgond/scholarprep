using ScholarPrep.Domain.Common;

namespace ScholarPrep.Domain.Entities;

public class Enrollment : BaseEntity, ITenantEntity
{
    public Guid StudentId { get; set; }
    public Guid ClassId { get; set; }
    public DateOnly EnrollmentDate { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid TenantId { get; set; }
    
    // Navigation properties
    public virtual Student Student { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
    public virtual Tenant Tenant { get; set; } = null!;
}
