using Application.Interface;
using Application.Interfaces.Academic;
using Domain.Academic.Entities;
using Infrastructure.Data.Persistence.Academic;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data.Repository.EF.Academic;


public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly AcademicDbContext _db;
    private readonly ITenantContext _tenant;

    public EnrollmentRepository(AcademicDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    // ------------------------------------------------
    // CREATE
    // ------------------------------------------------
    public async Task<Enrollment> AddAsync(Enrollment entity)
    {
        entity.TenantId = _tenant.TenantId;
        entity.CampusId = _tenant.CampusId;
        entity.CreatedAt = DateTime.UtcNow;
        entity.CreatedBy = _tenant.UserId;
        entity.IsActive = true;

        await _db.Enrollments.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    // ------------------------------------------------
    // GET BY ID
    // ------------------------------------------------
    public async Task<Enrollment?> GetByIdAsync(Guid id)
    {
        return await _db.Enrollments
            .FirstOrDefaultAsync(e =>
                e.Id == id &&
                e.TenantId == _tenant.TenantId &&
                !e.IsDeleted
            );
    }

    // ------------------------------------------------
    // UPDATE
    // ------------------------------------------------
    public async Task UpdateAsync(Enrollment entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        _db.Enrollments.Update(entity);
        await _db.SaveChangesAsync();
    }

    // ------------------------------------------------
    // SOFT DELETE
    // ------------------------------------------------
    public async Task SoftDeleteAsync(Guid id)
    {
        var entity = await _db.Enrollments
            .FirstOrDefaultAsync(e =>
                e.Id == id &&
                e.TenantId == _tenant.TenantId
            );

        if (entity == null) return;

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        entity.UpdatedBy = _tenant.UserId;

        await _db.SaveChangesAsync();
    }

    // ------------------------------------------------
    // HARD DELETE (optional)
    // ------------------------------------------------
    public async Task HardDeleteAsync(Guid id)
    {
        var entity = await _db.Enrollments
            .FirstOrDefaultAsync(e =>
                e.Id == id &&
                e.TenantId == _tenant.TenantId);

        if (entity == null) return;

        _db.Enrollments.Remove(entity);
        await _db.SaveChangesAsync();
    }

    // ------------------------------------------------
    // GET BY STUDENT
    // ------------------------------------------------
    public async Task<List<Enrollment>> GetByStudentAsync(Guid studentId)
    {
        return await _db.Enrollments
            .Where(e =>
                e.StudentId == studentId &&
                e.TenantId == _tenant.TenantId &&
                !e.IsDeleted)
            .ToListAsync();
    }
}

