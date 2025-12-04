using Domain.Enums.Core;

namespace Application.DTO.Auth;

public record AuthUserDto(
    Guid Id,
    string Email,
    string Token,
    UserRole Role
);