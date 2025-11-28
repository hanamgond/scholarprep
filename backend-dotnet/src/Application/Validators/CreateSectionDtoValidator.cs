using Application.DTO.Academic;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class CreateSectionDtoValidator : AbstractValidator<CreateSectionDto>
{
    public CreateSectionDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Section name is required")
            .MaximumLength(50);

        RuleFor(x => x.ClassId)
            .NotEmpty().WithMessage("ClassId is required");
    }
}
