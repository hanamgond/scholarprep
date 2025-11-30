using Application.DTO.Core;
using FluentValidation;

namespace Application.Validators.Tenants;

public class CreateTenantDtoValidator : AbstractValidator<CreateTenantDto>
{
    public CreateTenantDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().MaximumLength(150);
    }
}