using Microsoft.EntityFrameworkCore;
using ScholarPrep.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.EF;

public class GenericRepository<T> where T : BaseEntity
{
    private readonly DbContext _context;
    private readonly DbSet<T> _set;

    public GenericRepository(DbContext context)
    {
        _context = context;
        _set = context.Set<T>();
    }

    public async Task<T> AddAsync(T entity)
    {
        await _set.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _set.FindAsync(id);
    }

    public async Task UpdateAsync(T entity)
    {
        _set.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _set.FindAsync(id);
        if (entity != null)
        {
            _set.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}

