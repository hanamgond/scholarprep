using ScholarPrep.Domain.Common;

namespace ScholarPrep.Domain.Entities;

public class Section : BaseEntity, ITenantEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid TenantId { get; set; }
    public Guid ClassId { get; set; }
    
    // Navigation properties
    public virtual Class Class { get; set; } = null!;
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}