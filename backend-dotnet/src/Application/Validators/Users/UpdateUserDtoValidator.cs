
using Application.DTO.Core;
using FluentValidation;

namespace Application.Validators.Users;

public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDto> 
{ 
    public UpdateUserDtoValidator() 
    { 
        RuleFor(x => x.FirstName).MaximumLength(120); 
    }
}
