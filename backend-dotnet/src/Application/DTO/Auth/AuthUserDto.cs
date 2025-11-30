namespace Application.DTO.Auth;

public record AuthUserDto(
    Guid Id,
    string Email,
    string Token,
    string Role
);