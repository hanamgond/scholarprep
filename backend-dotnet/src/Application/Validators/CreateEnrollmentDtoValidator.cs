using Application.DTO.Academic;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class CreateEnrollmentDtoValidator : AbstractValidator<CreateEnrollmentDto>
{
    public CreateEnrollmentDtoValidator()
    {
        RuleFor(x => x.StudentId).NotEmpty();
        RuleFor(x => x.ClassId).NotEmpty();
        RuleFor(x => x.SectionId).NotEmpty();

        RuleFor(x => x)
            .Must(x => x.ClassId != Guid.Empty && x.SectionId != Guid.Empty)
            .WithMessage("ClassId and SectionId must be valid.");
    }
}

