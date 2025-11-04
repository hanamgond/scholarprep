using ScholarPrep.Domain.Common;

namespace ScholarPrep.Domain.Entities;

public class Tenant : BaseEntity, ITenantEntity
{
    public string Name { get; set; } = string.Empty;
    public string DatabaseConnectionString { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public Guid TenantId { get; set; } // Self-reference for consistency
    
    // Navigation properties
    public virtual ICollection<Campus> Campuses { get; set; } = new List<Campus>();
    public virtual ICollection<User> Users { get; set; } = new List<User>();
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
}
