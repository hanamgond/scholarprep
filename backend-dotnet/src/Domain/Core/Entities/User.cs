using Domain.Common;
using Domain.Enums.Core;
using ScholarPrep.Domain.Common;

namespace Domain.Core.Entities;

public class User : BaseEntity, ITenantEntity, ICampusEntity
{
    public Guid TenantId { get; set; }
    //added for user related to campus and not for TenantAdmin and SuperAdmin
    public Guid CampusId { get; set; } = Guid.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Student;
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public virtual Tenant Tenant { get; set; } = null!;
}
