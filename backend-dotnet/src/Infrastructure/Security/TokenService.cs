using Application.DTO.Auth;
using Application.DTO.Core;
using Application.Interface.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Security;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly byte[] _key;
    private readonly int _accessMinutes;
    private readonly int _refreshDays;

    public TokenService(IConfiguration config)
    {
        _config = config;
        _key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
        _accessMinutes = int.Parse(_config["Jwt:AccessTokenExpirationMinutes"] ?? "15");
        _refreshDays = int.Parse(_config["Jwt:RefreshTokenExpirationDays"] ?? "30");
    }

    public AuthResultDto GenerateTokens(UserDto user)
    {
        var now = DateTime.UtcNow;
        var accessExp = now.AddMinutes(_accessMinutes);
        var refreshExp = now.AddDays(_refreshDays);

        var claims = new List<Claim>()
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("userId", user.Id.ToString()),
            new Claim("tenantId", user.TenantId.ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("email", user.Email ?? string.Empty)
        };

        // Add campusId only when user is campus-scoped
        if (user.CampusId != Guid.Empty)
        {
            claims.Add(new Claim("campusId", user.CampusId.ToString()));
        }

        var creds = new SigningCredentials(new SymmetricSecurityKey(_key), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            notBefore: now,
            expires: accessExp,
            signingCredentials: creds
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        var (refreshToken, refreshTokenHash) = GenerateRefreshToken();

        return new AuthResultDto(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            AccessTokenExpiresAt: accessExp,
            RefreshTokenExpiresAt: refreshExp,
            Role: user.Role
        );
    }

    public (string token, string tokenHash) GenerateRefreshToken()
    {
        // generate 64 bytes token and return raw + SHA256 hash
        var random = RandomNumberGenerator.GetBytes(64);
        var token = Convert.ToBase64String(random); // can be URL-safe if needed

        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(token));
        var tokenHash = Convert.ToBase64String(hash);

        return (token, tokenHash);
    }

    public ClaimsPrincipal? ValidatePrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidAudience = _config["Jwt:Audience"],
            ValidateIssuer = true,
            ValidIssuer = _config["Jwt:Issuer"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(_key),
            ValidateLifetime = false // we only want principal from expired token
        };

        var handler = new JwtSecurityTokenHandler();
        try
        {
            var principal = handler.ValidateToken(token, tokenValidationParameters, out var securityToken);
            if (securityToken is JwtSecurityToken jwt && jwt.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                return principal;
        }
        catch { /* invalid token */ }

        return null;
    }
}


