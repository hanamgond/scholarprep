using Domain.Core.Entities;
using Infrastructure.Data.Persistence.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository.EF.Core;

public class TenantRepository : ITenantRepository
{
    private readonly CoreDbContext _db;

    public TenantRepository(CoreDbContext db)
    {
        _db = db;
    }

    public async Task<Tenant> AddAsync(Tenant entity)
    {
        await _db.Tenants.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    //Added below method just if dapper did not work properly, else remove this
    public async Task<Tenant?> GetByIdAsync(Guid id)
    {
        return await _db.Tenants.FirstOrDefaultAsync(t => t.Id == id && !t.IsDeleted);
    }

    //Added below method just if dapper did not work properly, else remove this
    public async Task<List<Tenant>> GetAllAsync()
    {
        return await _db.Tenants.ToListAsync();
    }

    public async Task UpdateAsync(Tenant entity)
    {
        _db.Tenants.Update(entity);
        await _db.SaveChangesAsync();
    }
    public async Task SoftDeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity == null) return;

        _db.Entry(entity).State = EntityState.Deleted;
        await _db.SaveChangesAsync();
    }
}
