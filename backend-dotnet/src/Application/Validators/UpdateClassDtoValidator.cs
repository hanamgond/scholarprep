using Application.DTO.Academic;
using FluentValidation;

namespace Application.Validators;


public class UpdateClassDtoValidator : AbstractValidator<UpdateClassDto>
{
    public UpdateClassDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
    }
}

