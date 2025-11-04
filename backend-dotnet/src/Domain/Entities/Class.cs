using ScholarPrep.Domain.Common;

namespace ScholarPrep.Domain.Entities;

public class Class : BaseEntity, ITenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public Guid CampusId { get; set; }
    public Guid TenantId { get; set; }
    
    // Navigation properties
    public virtual Campus Campus { get; set; } = null!;
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
