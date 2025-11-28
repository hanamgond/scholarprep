using Application.Interface;
using Application.Interfaces.Academic;
using Domain.Academic.Entities;
using Infrastructure.Data.Persistence.Academic;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Repository.EF.Academic;

public class SectionRepository : ISectionRepository
{
    private readonly AcademicDbContext _db;
    private readonly ITenantContext _tenant;

    public SectionRepository(AcademicDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    // -------------------------------------------
    // CREATE
    // -------------------------------------------
    public async Task<Section> AddAsync(Section entity)
    {
        entity.TenantId = _tenant.TenantId;
        entity.CampusId = _tenant.CampusId;
        entity.CreatedBy = _tenant.UserId;
        entity.CreatedAt = DateTime.UtcNow;

        await _db.Sections.AddAsync(entity);
        await _db.SaveChangesAsync();

        return entity;
    }

    // -------------------------------------------
    // GET ONE
    // -------------------------------------------
    public async Task<Section?> GetByIdAsync(Guid id)
    {
        return await _db.Sections
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.TenantId == _tenant.TenantId &&
                s.CampusId == _tenant.CampusId &&
                s.IsDeleted == false);
    }

    // -------------------------------------------
    // GET BY CLASS
    // -------------------------------------------
    public async Task<List<Section>> GetByClassAsync(Guid classId)
    {
        return await _db.Sections
            .Where(s =>
                s.ClassId == classId &&
                s.TenantId == _tenant.TenantId &&
                s.CampusId == _tenant.CampusId &&
                s.IsDeleted == false)
            .ToListAsync();
    }

    // -------------------------------------------
    // UPDATE
    // -------------------------------------------
    public async Task UpdateAsync(Section entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        _db.Sections.Update(entity);
        await _db.SaveChangesAsync();
    }

    // -------------------------------------------
    // SOFT DELETE
    // -------------------------------------------
    public async Task SoftDeleteAsync(Guid id)
    {
        var entity = await _db.Sections
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.TenantId == _tenant.TenantId &&
                s.CampusId == _tenant.CampusId);

        if (entity is null)
            return;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;
        _db.Sections.Update(entity);
        await _db.SaveChangesAsync();
    }

    // -------------------------------------------
    // HARD DELETE (Optional)
    // -------------------------------------------
    public async Task HardDeleteAsync(Guid id)
    {
        var entity = await _db.Sections
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.TenantId == _tenant.TenantId &&
                s.CampusId == _tenant.CampusId);

        if (entity is null)
            return;

        _db.Sections.Remove(entity);
        await _db.SaveChangesAsync();
    }
}

