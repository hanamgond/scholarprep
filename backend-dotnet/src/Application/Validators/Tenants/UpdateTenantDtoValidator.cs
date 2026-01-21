using Application.DTO.Core;
using FluentValidation;

namespace Application.Validators.Tenants;

public class UpdateTenantDtoValidator : AbstractValidator<UpdateTenantDto>
{
    public UpdateTenantDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().MaximumLength(150);
    }
}