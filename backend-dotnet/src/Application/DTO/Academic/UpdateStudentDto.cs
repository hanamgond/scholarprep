
namespace Application.DTO.Academic;

public record UpdateStudentDto(
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    DateOnly? DateOfBirth,
    string? RollNumber,
    string? Gender,
    string? FatherName,
    string? FatherMobile,
    string? MotherName,
    string? MotherMobile,
    string? Address
);
