namespace Application.DTO.Academic;

public record CreateStudentDto(
    string FirstName,
    string LastName,
    string AdmissionNo,
    Guid ClassId,
    Guid SectionId,
    string? Email = null,
    string? Phone = null,
    DateOnly? DateOfBirth = null,
    string? RollNumber = null,
    string? Gender = null,
    string? FatherName = null,
    string? FatherMobile = null,
    string? MotherName = null,
    string? MotherMobile = null,
    string? Address = null
);



