using ScholarPrep.Domain.Common;

namespace ScholarPrep.Domain.Entities;

public class Campus : BaseEntity, ITenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public Guid TenantId { get; set; }
    
    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual ICollection<Class> Classes { get; set; } = new List<Class>();
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
