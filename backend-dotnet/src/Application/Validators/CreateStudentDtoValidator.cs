using Application.DTO.Academic;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Application.Validators;

public class CreateStudentDtoValidator : AbstractValidator<CreateStudentDto>
{
    // The revised regex pattern
    private const string IndianMobileRegex = @"^((\+91[\-\s]?)?|0|91)?[6789]\d{9}$";
    public CreateStudentDtoValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(120);
        RuleFor(x => x.AdmissionNo).NotEmpty().MaximumLength(50);
        RuleFor(x => x.ClassId).NotEmpty();
        RuleFor(x => x.SectionId).NotEmpty();
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email));
        RuleFor(x => x.Phone).Matches(new Regex(IndianMobileRegex))
            .WithMessage("Invalid mobile number format. Use 10 digits (6-9 prefix), with optional +91, 0, or 91 prefix.")
            .When(x => !string.IsNullOrEmpty(x.Phone)); // Makes the field optional
        RuleFor(x => x.FatherMobile).Matches(new Regex(IndianMobileRegex))
            .WithMessage("Invalid mobile number format. Use 10 digits (6-9 prefix), with optional +91, 0, or 91 prefix.")
            .When(x => !string.IsNullOrEmpty(x.FatherMobile)); // Makes the field optional
        RuleFor(x => x.MotherMobile).Matches(new Regex(IndianMobileRegex))
            .WithMessage("Invalid mobile number format. Use 10 digits (6-9 prefix), with optional +91, 0, or 91 prefix.")
            .When(x => !string.IsNullOrEmpty(x.MotherMobile)); // Makes the field optional
        RuleFor(x => x.DateOfBirth).LessThan(DateOnly.FromDateTime(DateTime.Today)).When(x => x.DateOfBirth.HasValue);
    }
}

