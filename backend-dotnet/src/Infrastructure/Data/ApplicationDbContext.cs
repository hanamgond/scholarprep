using Microsoft.EntityFrameworkCore;
using ScholarPrep.Shared.Interfaces; // 👈 FIX: Changed from 'ScholarPrep.Application.Common.Interfaces'
using ScholarPrep.Domain.Common;
using ScholarPrep.Domain.Entities;
using ScholarPrep.Infrastructure.Interceptors;

namespace ScholarPrep.Infrastructure.Data;

// This class definition will now work because the correct 'using' statement is above
public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly TenantInterceptor _tenantInterceptor;
    
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        TenantInterceptor tenantInterceptor) : base(options)
    {
        _tenantInterceptor = tenantInterceptor;
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Campus> Campuses => Set<Campus>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Class> Classes => Set<Class>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_tenantInterceptor);
        base.OnConfiguring(optionsBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}