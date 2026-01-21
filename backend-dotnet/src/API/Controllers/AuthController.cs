using Application.DTO.Auth;
using Application.Services.Auth;
using Application.Services.Auth.ChangePassword;
using Application.Services.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ScholarPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator) => _mediator = mediator;

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto req)
    {
        var dummy = false;
        // --- THIS IS A DUMMY LOGIN ---
        // TODO: Replace this with real database user validation
        if (dummy)
        {
            if (req.Email == "admin@test.com" && req.Password == "password")
            {
                // User is valid, generate a token
                var token = GenerateJwtToken(req.Email);

                // Return the token to the frontend
                return Ok(new { accessToken = token });
            }

            // User is invalid
            return Unauthorized(new { message = "Invalid credentials" });
        }
        else
        {
            //updated code to keep for db connection
            try
            {
                var resp = await _mediator.Send(new LoginCommand(req));
                return Ok(resp);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }

        }
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
    {
        return Ok(await _mediator.Send(new RefreshTokenCommand(dto)));
    }

    [HttpPost("revoke")]
    [Authorize] // user must be logged in
    public async Task<IActionResult> Revoke([FromBody] RevokeRequestDto dto)
    {
        await _mediator.Send(new RevokeRefreshTokenCommand(dto));
        return NoContent();
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        await _mediator.Send(new ChangePasswordCommand(dto));
        return NoContent();
    }


    private string GenerateJwtToken(string email)
    {
        // Get secret key from appsettings.json
        // WARNING: Make sure your appsettings.json has a "Jwt:Key" value!
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("LONG_SECURE_RANDOM_KEY_AT_LEAST_32_CHARS"));
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
            issuer: "http://localhost:5168",
            audience: "http://localhost:5168",
            claims: claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}