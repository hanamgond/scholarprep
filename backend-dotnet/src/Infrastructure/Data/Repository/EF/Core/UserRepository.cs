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

public class UserRepository : IUserRepository
{
    private readonly CoreDbContext _db;
    private readonly ITenantContext _tenant;
    public UserRepository(CoreDbContext db, ITenantContext tenant) { _db = db; _tenant = tenant; }

    public async Task<User> AddAsync(User e)
    {
        e.TenantId = _tenant.TenantId;
        await _db.Users.AddAsync(e);
        await _db.SaveChangesAsync();
        return e;
    }

    public async Task<User?> GetByIdAsync(Guid id) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Id == id && u.TenantId == _tenant.TenantId && !u.IsDeleted);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Email == email && u.TenantId == _tenant.TenantId && !u.IsDeleted);

    public async Task UpdateAsync(User e) { _db.Users.Update(e); await _db.SaveChangesAsync(); }

    public async Task SoftDeleteAsync(Guid id)
    {
        var e = await _db.Users.FirstOrDefaultAsync(u => u.Id == id && u.TenantId == _tenant.TenantId);
        if (e == null) return;
        _db.Entry(e).State = EntityState.Deleted; // SaveChanges interceptor will soft-delete
        await _db.SaveChangesAsync();
    }

    public async Task HardDeleteAsync(Guid id)
    {
        var e = await _db.Users.FirstOrDefaultAsync(u => u.Id == id && u.TenantId == _tenant.TenantId);
        if (e == null) return;
        _db.Users.Remove(e);
        await _db.SaveChangesAsync();
    }

    public async Task<List<User>> GetByTenantAsync(Guid tenantId) =>
        await _db.Users.Where(u => u.TenantId == tenantId && !u.IsDeleted).ToListAsync();

    public async Task<List<User>> GetByCampusAsync(Guid campusId) =>
        await _db.Users.Where(u => u.CampusId == campusId && !u.IsDeleted).ToListAsync();
}

