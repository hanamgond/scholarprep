namespace Application.DTO.Academic;

public record StudentDto(
    Guid Id,
    Guid TenantId,
    Guid CampusId,
    Guid ClassId,
    Guid SectionId,
    string FirstName,
    string LastName,
    string AdmissionNo,
    string? Email,
    string? Phone,
    DateOnly? DateOfBirth,
    string? RollNumber,
    string? Gender,
    string? FatherName,
    string? FatherMobile,
    string? MotherName,
    string? MotherMobile,
    string? Address,
    string Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    Guid CreatedBy,
    Guid? UpdatedBy
);

