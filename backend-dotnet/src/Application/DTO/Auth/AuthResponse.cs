

namespace Application.DTO.Auth;

public record AuthResponse(string Token, DateTime ExpiresAt);