using ScholarPrep.Domain.Common;

namespace ScholarPrep.Domain.Entities;

public class Student : BaseEntity, ITenantEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string AdmissionNo { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateOnly DateOfBirth { get; set; }
    public Guid TenantId { get; set; }
    public Guid CampusId { get; set; }
    
    // --- ADDED NEW OPTIONAL FIELDS ---
    public string? RollNumber { get; set; }
    public string? Gender { get; set; }
    public string? FatherName { get; set; }
    public string? FatherMobile { get; set; }
    public string? MotherName { get; set; }
    public string? MotherMobile { get; set; }
    public string? Address { get; set; } // Added from your frontend payload
    
    // --- Navigation properties ---
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual Campus Campus { get; set; } = null!;
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}