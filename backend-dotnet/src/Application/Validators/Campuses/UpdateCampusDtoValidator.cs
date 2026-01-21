using Application.DTO.Core;
using FluentValidation;

namespace Application.Validators.Campuses;

public class UpdateCampusDtoValidator : AbstractValidator<UpdateCampusDto>
{
    public UpdateCampusDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Address).NotEmpty().MaximumLength(500);
    }
}
