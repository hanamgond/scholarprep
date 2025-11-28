using Application.Interface;
using Application.Interfaces.Academic;
using Domain.Academic.Entities;
using Infrastructure.Data.Persistence.Academic;
using Infrastructure.Multitenancy;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository.EF.Academic;


public class ClassRepository : IClassRepository
{
    private readonly AcademicDbContext _db;
    private readonly ITenantContext _tenant;

    public ClassRepository(AcademicDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    public async Task<Class> AddAsync(Class entity)
    {
        entity.TenantId = _tenant.TenantId;
        // If CampusId provided in DTO must be checked by handler; here remain as set
        entity.CreatedAt = DateTime.UtcNow;
        entity.CreatedBy = _tenant.UserId;
        entity.IsActive = true;

        await _db.Classes.AddAsync(entity);
        await _db.SaveChangesAsync();

        return entity;
    }

    public async Task<Class?> GetByIdAsync(Guid id)
    {
        return await _db.Classes
            .FirstOrDefaultAsync(c => c.Id == id && c.TenantId == _tenant.TenantId && !c.IsDeleted);
    }

    public async Task<List<Class>> GetByCampusAsync(Guid campusId)
    {
        return await _db.Classes
            .Where(c => c.CampusId == campusId && c.TenantId == _tenant.TenantId && !c.IsDeleted)
            .ToListAsync();
    }

    public async Task<List<Class>> GetByTenantAsync(Guid tenantId)
    {
        return await _db.Classes
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .ToListAsync();
    }

    public async Task<List<Class>> GetAllAsync(Guid tenantId)
    {
        return await _db.Classes
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .ToListAsync();
    }

    public async Task UpdateAsync(Class entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        _db.Classes.Update(entity);
        await _db.SaveChangesAsync();
    }

    public async Task SoftDeleteAsync(Guid id)
    {
        var e = await _db.Classes.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == _tenant.TenantId);
        if (e == null) return;
        e.IsDeleted = true;
        e.UpdatedAt = DateTime.UtcNow;
        e.UpdatedBy = _tenant.UserId;
        await _db.SaveChangesAsync();
    }

    public async Task HardDeleteAsync(Guid id)
    {
        var e = await _db.Classes.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == _tenant.TenantId);
        if (e == null) return;
        _db.Classes.Remove(e);
        await _db.SaveChangesAsync();
    }
}


