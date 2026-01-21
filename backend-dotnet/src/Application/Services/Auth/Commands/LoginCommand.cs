using Application.DTO.Auth;
using MediatR;

namespace Application.Services.Auth.Commands;

public record LoginCommand(LoginRequestDto Dto) : IRequest<AuthResultDto>;
public record RefreshTokenCommand(RefreshRequestDto Dto) : IRequest<AuthResultDto>;
public record RevokeRefreshTokenCommand(RevokeRequestDto Dto) : IRequest<bool>;

