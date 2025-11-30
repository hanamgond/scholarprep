using Application.DTO.Auth;
using MediatR;

namespace Application.Services.Auth.ChangePassword;

public record ChangePasswordCommand(ChangePasswordDto Dto) : IRequest<bool>;