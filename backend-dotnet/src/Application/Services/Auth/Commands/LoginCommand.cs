using Application.DTO.Auth;
using MediatR;

namespace Application.Services.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;

