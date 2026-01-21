using Application.DTO.Auth;
using Application.DTO.Core;
using Domain.Core.Entities;
using System.Security.Claims;

namespace Application.Interface.Security;

public interface ITokenService
{
    AuthResultDto GenerateTokens(UserDto user);
    (string token, string tokenHash) GenerateRefreshToken(); // raw + hash
    ClaimsPrincipal? ValidatePrincipalFromExpiredToken(string token);
}

