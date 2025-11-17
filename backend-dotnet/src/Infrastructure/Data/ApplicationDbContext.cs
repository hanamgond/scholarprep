// src/Infrastructure/Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Shared.Interfaces;
using ScholarPrep.Domain.Common;
using ScholarPrep.Domain.Entities;
using ScholarPrep.Infrastructure.Interceptors;

namespace ScholarPrep.Infrastructure.Data;

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
    public DbSet<User> Users => Set<User>();
    
    // Corrected List:
    public DbSet<Class> Classes => Set<Class>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

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