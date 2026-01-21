using Domain.Common;
using Domain.Core.Entities;
using ScholarPrep.Domain.Common;

namespace Domain.Academic.Entities;

public class Enrollment : BaseEntity, ITenantEntity, ICampusEntity
{
    public Guid TenantId { get; set; }
    public Guid CampusId { get; set; }
    public Guid StudentId { get; set; }
    public Guid ClassId { get; set; }
    public Guid SectionId { get; set; }

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual Student Student { get; set; } = null!;
    public virtual Section Section { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
}
