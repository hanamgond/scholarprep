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

    public CampusRepository(CoreDbContext db)
    {
        _db = db;
    }

    public async Task<Campus> AddAsync(Campus entity)
    {
        await _db.Campuses.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    //Remove if dapper work
    public async Task<Campus?> GetByIdAsync(Guid id)
    {
        return await _db.Campuses.FirstOrDefaultAsync(c => c.Id == id);
    }

    //Remove if dapper work
    public async Task<List<Campus>> GetByTenantAsync(Guid tenantId)
    {
        return await _db.Campuses
            .Where(c => c.TenantId == tenantId)
            .ToListAsync();
    }

    public async Task UpdateAsync(Campus entity)
    {
        _db.Campuses.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var campus = await _db.Campuses.FindAsync(id);
        if (campus != null)
        {
            _db.Campuses.Remove(campus);
            await _db.SaveChangesAsync();
        }
    }
}

