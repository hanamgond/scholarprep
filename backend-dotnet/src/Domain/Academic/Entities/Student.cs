using Domain.Common;
using Domain.Core.Entities;
using Domain.Enums.Academic;
using ScholarPrep.Domain.Common;

namespace Domain.Academic.Entities;

public class Student : BaseEntity, ITenantEntity, ICampusEntity
{
    public Guid TenantId { get; set; }
    public Guid CampusId { get; set; }
    public Guid ClassId { get; set; }
    public Guid SectionId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string AdmissionNo { get; set; } = string.Empty;

    // --- ADDED NEW OPTIONAL FIELDS ---
    public string? Email { get; set; } = string.Empty;
    public string? Phone { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string? RollNumber { get; set; }
    public string? Gender { get; set; }
    public string? FatherName { get; set; }
    public string? FatherMobile { get; set; }
    public string? MotherName { get; set; }
    public string? MotherMobile { get; set; }
    public string? Address { get; set; } // Added from your frontend payload
    public StudentStatus Status { get; set; } = StudentStatus.Active;
    // --- Navigation properties ---
    public virtual Section Section { get; set; } = null!;
   // public virtual Campus Campus { get; set; } = null!;
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}