using Application.DTO.Auth;
using Application.Interface.Security;
using Application.Services.Auth.Commands;
using Infrastructure.Data.Repository.EF.Core.Interface;
using MediatR;  

namespace Application.Services.Auth.Handlers;

public class LoginHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IUserRepository _users;
    private readonly ITokenService _tokenService;

    public LoginHandler(IUserRepository users, ITokenService tokenService)
    {
        _users = users;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _users.GetByEmailAsync(request.Email);
        if (user == null) throw new UnauthorizedAccessException("Invalid credentials");

        // Password check - use a secure hasher in prod
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials");

        var token = _tokenService.Generate(user, out var expiresAt);
        return new AuthResponse(token, expiresAt);
    }
}

