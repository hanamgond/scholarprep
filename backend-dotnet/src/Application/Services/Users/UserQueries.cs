using Application.DTO.Core;
using MediatR;

namespace Application.Services.Users;

public record GetUserByIdQuery(Guid UserId) : IRequest<UserDto>;
public record GetUserByEmailQuery(string Email) : IRequest<UserDto>;
public record GetUsersByTenantQuery() : IRequest<List<UserDto>>; // tenant-scoped
public record GetUsersByCampusQuery(Guid CampusId) : IRequest<List<UserDto>>;