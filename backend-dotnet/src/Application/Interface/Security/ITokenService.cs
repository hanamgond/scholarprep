using Domain.Core.Entities;

namespace Application.Interface.Security;

public interface ITokenService
{
    string Generate(User user, out DateTime expiresAt);
}
