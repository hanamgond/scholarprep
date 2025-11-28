using Domain.Academic.Entities;
using ScholarPrep.Domain.Common;

namespace Domain.Core.Entities;

public class Campus : BaseEntity, ITenantEntity
{
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
}
