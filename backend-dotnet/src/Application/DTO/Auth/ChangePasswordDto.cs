
namespace Application.DTO.Auth;

public record ChangePasswordDto(
    string CurrentPassword,
    string NewPassword
);