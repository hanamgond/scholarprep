using Domain.Common;
using Domain.Core.Entities;
using ScholarPrep.Domain.Common;
using static System.Collections.Specialized.BitVector32;

namespace Domain.Academic.Entities;

public class Class : BaseEntity, ITenantEntity, ICampusEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid CampusId { get; set; }
    public Guid TenantId { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<Section> Sections { get; set; } = new List<Section>();
}
