using Application.DTO.Academic;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class CreateClassDtoValidator : AbstractValidator<CreateClassDto>
{
    public CreateClassDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(150);

        RuleFor(x => x.CampusId)
            .NotEmpty().WithMessage("CampusId is required");
    }
}

