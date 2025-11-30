
using Application.DTO.Core;
using MediatR;

namespace Application.Services.Users;

public record CreateUserCommand(CreateUserDto Dto) : IRequest<UserDto>;
public record UpdateUserCommand(Guid UserId, UpdateUserDto Dto) : IRequest<UserDto>;
public record DeleteUserCommand(Guid UserId) : IRequest<bool>;