using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ScholarPrep.API.Controllers;

// DTO to define what the login form will send
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    // This handles: POST /api/auth/login
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest loginRequest)
    {
        // --- THIS IS A DUMMY LOGIN ---
        // TODO: Replace this with real database user validation
        if (loginRequest.Email == "admin@test.com" && loginRequest.Password == "password")
        {
            // User is valid, generate a token
            var token = GenerateJwtToken(loginRequest.Email);
            
            // Return the token to the frontend
            return Ok(new { accessToken = token });
        }
        
        // User is invalid
        return Unauthorized(new { message = "Invalid credentials" });
    }

    private string GenerateJwtToken(string email)
    {
        // Get secret key from appsettings.json
        // WARNING: Make sure your appsettings.json has a "Jwt:Key" value!
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // Create claims (the token's "payload")
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim("userId", "12345"), // TODO: Get real user ID from DB
            new Claim("tenantId", "00000000-0000-0000-0000-000000000000") // TODO: Get real tenant ID
        };

        // Create the token
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}