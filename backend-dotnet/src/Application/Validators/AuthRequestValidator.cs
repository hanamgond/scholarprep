using Application.DTO.Auth;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Validators;

public class AuthRequestValidator : AbstractValidator<LoginRequestDto>
{
    public AuthRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("Minimum length 6");
    }
}

