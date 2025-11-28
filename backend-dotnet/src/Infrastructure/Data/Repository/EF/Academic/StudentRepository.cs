using Application.Interface;
using Application.Interfaces.Academic;
using Domain.Academic.Entities;
using Infrastructure.Data.Persistence.Academic;
using Microsoft.EntityFrameworkCore;


namespace Infrastructure.Data.Repository.EF.Academic;

public class StudentRepository : IStudentRepository
{
    private readonly AcademicDbContext _db;
    private readonly ITenantContext _tenant;

    public StudentRepository(AcademicDbContext db, ITenantContext tenant)
    {
        _db = db;
        _tenant = tenant;
    }

    public async Task<Student> AddAsync(Student entity)
    {
        entity.TenantId = _tenant.TenantId;
        entity.CampusId = _tenant.CampusId;

        await _db.Students.AddAsync(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task<Student?> GetByIdAsync(Guid id)
    {
        return await _db.Students
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                s.TenantId == _tenant.TenantId &&
                s.CampusId == _tenant.CampusId);
    }

    public async Task UpdateAsync(Student student)
    {
        _db.Students.Update(student);
        await _db.SaveChangesAsync();
    }
}

