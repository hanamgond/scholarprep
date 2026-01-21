using Application.DTO.Core;
using FluentValidation;

namespace Application.Validators.Users;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.FirstName).NotEmpty(); 
        RuleFor(x => x.Role).IsInEnum();
    }
}
