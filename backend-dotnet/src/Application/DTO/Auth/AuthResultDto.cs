

using Domain.Enums.Core;

namespace Application.DTO.Auth;

public record AuthResultDto(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt,
    UserRole Role
);