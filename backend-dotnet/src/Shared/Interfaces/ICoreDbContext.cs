using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface ICoreDbContext
    {
        DbSet<Tenant> Tenants { get; }
        DbSet<Campus> Campuses { get; }
        DbSet<User> Users { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
