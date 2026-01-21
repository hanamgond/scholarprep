
using Application.DTO.Academic;
using FluentValidation;
using System.Text.RegularExpressions;

namespace Application.Validators;

public class UpdateStudentDtoValidator : AbstractValidator<UpdateStudentDto>
{
    // Reusable regex for optional Indian mobile numbers
    private const string IndianMobileRegex = @"^((\+91[\-\s]?)?|0|91)?[6-9]\d{9}$";
    private static readonly Regex MobileRegex = new Regex(IndianMobileRegex, RegexOptions.Compiled);

    public UpdateStudentDtoValidator()
    {
        // --- Mandatory Fields ---

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First Name is required.")
            .Length(2, 50).WithMessage("First Name must be between 2 and 50 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last Name is required.")
            .Length(2, 50).WithMessage("Last Name must be between 2 and 50 characters.");

        // --- Optional Fields with Validation ---

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("A valid email address is required.")
            .When(x => !string.IsNullOrEmpty(x.Email)); // Optional field

        RuleFor(x => x.Phone)
            .Matches(MobileRegex).WithMessage("Invalid phone number format.")
            .When(x => !string.IsNullOrEmpty(x.Phone)); // Optional field

        RuleFor(x => x.FatherMobile)
            .Matches(MobileRegex).WithMessage("Invalid father's mobile number format.")
            .When(x => !string.IsNullOrEmpty(x.FatherMobile)); // Optional field

        RuleFor(x => x.MotherMobile)
            .Matches(MobileRegex).WithMessage("Invalid mother's mobile number format.")
            .When(x => !string.IsNullOrEmpty(x.MotherMobile)); // Optional field

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateOnly.FromDateTime(DateTime.Today.AddYears(-3)))
            .WithMessage("Student must be at least 3 years old.")
            .When(x => x.DateOfBirth.HasValue); // Optional field

        RuleFor(x => x.RollNumber)
            .MaximumLength(20).WithMessage("Roll Number cannot exceed 20 characters.")
            .When(x => !string.IsNullOrEmpty(x.RollNumber)); // Optional field

        RuleFor(x => x.Gender)
            .Must(BeAValidGender).WithMessage("Gender must be 'Male', 'Female', or 'Other'.")
            .When(x => !string.IsNullOrEmpty(x.Gender)); // Optional field

        RuleFor(x => x.Address)
            .MaximumLength(200).WithMessage("Address cannot exceed 200 characters.")
            .When(x => !string.IsNullOrEmpty(x.Address)); // Optional field

        // Father's and Mother's names are optional string fields,
        // we can apply optional length constraints if needed:
        RuleFor(x => x.FatherName)
            .MaximumLength(100).WithMessage("Father's Name cannot exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.FatherName));

        RuleFor(x => x.MotherName)
            .MaximumLength(100).WithMessage("Mother's Name cannot exceed 100 characters.")
            .When(x => !string.IsNullOrEmpty(x.MotherName));
    }

    // Custom validator for Gender field
    private bool BeAValidGender(string gender)
    {
        if (string.IsNullOrWhiteSpace(gender)) return true; // Handled by the When clause, but good practice

        return gender.Equals("Male", StringComparison.OrdinalIgnoreCase) ||
               gender.Equals("Female", StringComparison.OrdinalIgnoreCase) ||
               gender.Equals("Other", StringComparison.OrdinalIgnoreCase);
    }
}