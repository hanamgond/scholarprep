using Domain.Core.Entities;

namespace Application.Interface.Core.EF;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
    Task AddAsync(RefreshToken token);
    Task UpdateAsync(RefreshToken token);
    Task<IEnumerable<RefreshToken>> GetActiveTokensForUserAsync(Guid userId);
}