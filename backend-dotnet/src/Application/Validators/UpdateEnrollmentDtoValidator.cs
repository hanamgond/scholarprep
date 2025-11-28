using Application.DTO.Academic;
using FluentValidation;

namespace Application.Validators;

public class UpdateEnrollmentDtoValidator : AbstractValidator<UpdateEnrollmentDto>
{
    public UpdateEnrollmentDtoValidator()
    {
        RuleFor(x => x.ClassId).NotEmpty();
        RuleFor(x => x.SectionId).NotEmpty();
    }
}

