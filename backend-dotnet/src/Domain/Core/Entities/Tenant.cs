using Domain.Academic.Entities;
using ScholarPrep.Domain.Common;

namespace Domain.Core.Entities;

public class Tenant : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public virtual ICollection<Campus> Campuses { get; set; } = new List<Campus>();
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
