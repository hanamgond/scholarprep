using Application.Interface.Core.EF;
using Domain.Core.Entities;
using Infrastructure.Data.Persistence.Core;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository.EF.Core;
public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly CoreDbContext _db;

    public RefreshTokenRepository(CoreDbContext db)
    {
        _db = db;
    }

    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
    {
        return await _db.RefreshTokens
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.TokenHash == tokenHash && !t.IsDeleted);
    }

    public async Task AddAsync(RefreshToken token)
    {
        await _db.RefreshTokens.AddAsync(token);
        await _db.SaveChangesAsync();
    }

    // UPDATE (used for revoking, linking replaced token, etc.)
    // -------------------------------------------------------------
    public async Task UpdateAsync(RefreshToken token)
    {
        _db.RefreshTokens.Update(token);
        await _db.SaveChangesAsync();
    }

    // -------------------------------------------------------------
    // GET ACTIVE TOKENS FOR USER (needed for reuse detection)
    // -------------------------------------------------------------
    public async Task<IEnumerable<RefreshToken>> GetActiveTokensForUserAsync(Guid userId)
    {
        return await _db.RefreshTokens
            .Where(t =>
                t.UserId == userId &&
                !t.IsRevoked &&
                t.ExpiresAt > DateTime.UtcNow &&
                !t.IsDeleted)
            .ToListAsync();
    }
}
