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

    public UserRepository(CoreDbContext db)
    {
        _db = db;
    }

    public async Task<User> AddAsync(User user)
    {
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
        return user;
    }

    //Remove if dapper work
    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _db.Users
                        .AsNoTracking()
                        .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
    }
    //Remove if dapper work
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
    }

    public async Task UpdateAsync(User user)
    {
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user != null)
        {
            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
        }
    }
}

