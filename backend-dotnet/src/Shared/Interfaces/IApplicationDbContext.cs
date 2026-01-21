using Domain.Academic.Entities;
using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
// This links to the EF Core package

namespace ScholarPrep.Shared.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Tenant> Tenants { get; }
    DbSet<Campus> Campuses { get; }
    DbSet<Student> Students { get; }
    DbSet<Class> Classes { get; }
    DbSet<Enrollment> Enrollments { get; }
    DbSet<User> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}