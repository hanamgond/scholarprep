using Application.DTO.Core;
using FluentValidation;

namespace Application.Validators.Campuses;

public class CreateCampusDtoValidator : AbstractValidator<CreateCampusDto>
{
    public CreateCampusDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Address).NotEmpty().MaximumLength(500);
    }
}