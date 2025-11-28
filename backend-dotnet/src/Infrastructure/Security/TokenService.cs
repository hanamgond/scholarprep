using Application.Interface.Security;
using Domain.Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Security;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly int _expireMinutes;

    public TokenService(IConfiguration config)
    {
        _config = config;
        _expireMinutes = int.TryParse(_config["Jwt:ExpireMinutes"], out var m) ? m : 360;
    }

    public string Generate(User user, out DateTime expiresAt)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("tenantId", user.TenantId.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("userId", user.Id.ToString())
        };

        // Add campusId only when user is campus-scoped
        if (user.CampusId != Guid.Empty)
        {
            claims.Add(new Claim("campusId", user.CampusId.ToString()));
        }

        expiresAt = DateTime.UtcNow.AddMinutes(_expireMinutes);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

