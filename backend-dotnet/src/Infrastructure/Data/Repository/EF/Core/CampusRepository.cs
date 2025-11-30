using Application.Interface;
using Domain.Core.Entities;
using Infrastructure.Data.Persistence.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.EF.Core;

public class CampusRepository : ICampusRepository
{
    private readonly CoreDbContext _db;
    private readonly ITenantContext _tenant;

    public CampusRepository(CoreDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    public async Task<Campus> AddAsync(Campus entity)
    {
        // tenant and audit will be set by SaveChanges interceptor
        entity.TenantId = _tenant.TenantId;
        entity.IsActive = true;

        await _db.Campuses.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<Campus?> GetByIdAsync(Guid id)
    {
        return await _db.Campuses
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id && c.TenantId == _tenant.TenantId && !c.IsDeleted);
    }

    public async Task<List<Campus>> GetByTenantAsync(Guid tenantId)
    {
        return await _db.Campuses
            .AsNoTracking()
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .ToListAsync();
    }

    public async Task UpdateAsync(Campus entity)
    {
        // audit will be applied in SaveChanges
        _db.Campuses.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task SoftDeleteAsync(Guid id)
    {
        var entity = await _db.Campuses
            .FirstOrDefaultAsync(c => c.Id == id && c.TenantId == _tenant.TenantId);
        if (entity == null) return;

        // SaveChanges override will set IsDeleted when state becomes Deleted,
        // but here to be explicit we'll mark deleted by setting state:
        _db.Entry(entity).State = EntityState.Deleted;
        await _db.SaveChangesAsync();
    }

    public async Task HardDeleteAsync(Guid id)
    {
        var entity = await _db.Campuses
            .FirstOrDefaultAsync(c => c.Id == id && c.TenantId == _tenant.TenantId);
        if (entity == null) return;

        _db.DisableSoftDelete = true;
        _db.Campuses.Remove(entity);
        await _db.SaveChangesAsync();
    }
}

