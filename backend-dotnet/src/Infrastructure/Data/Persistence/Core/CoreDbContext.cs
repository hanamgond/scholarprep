using Application.Interface;
using Domain.Academic.Entities;
using Domain.Core.Entities;
using Infrastructure.Data.Persistence.Core.Configurations;
using Infrastructure.Multitenancy;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Domain.Common;

namespace Infrastructure.Data.Persistence.Core;

public class CoreDbContext : DbContext
{
    private readonly ITenantContext? _tenant;
    public CoreDbContext(DbContextOptions<CoreDbContext> options, ITenantContext? tenant) : base(options) 
    {
        _tenant = tenant;
    }

    public DbSet<Tenant> Tenants { get; set; } = null!;
    public DbSet<Campus> Campuses { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("core");

        modelBuilder.ApplyConfiguration(new TenantConfiguration());
        modelBuilder.ApplyConfiguration(new CampusConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());

        if (_tenant != null && _tenant.TenantId != Guid.Empty)
        {
            modelBuilder.Entity<Campus>().HasQueryFilter(c => c.TenantId == _tenant.TenantId);
            // For Users, we generally filter by tenant only (not campus) so TenantAdmin can see all campus users.
            modelBuilder.Entity<User>().HasQueryFilter(u => u.TenantId == _tenant.TenantId && u.IsActive);
            
        }

        modelBuilder.Entity<Campus>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<User>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Tenant>().HasQueryFilter(x => !x.IsDeleted);

        base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
        ApplyAuditInfo();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditInfo();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditInfo()
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
                entry.Entity.CreatedBy = _tenant.UserId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedBy = _tenant.UserId;
            }
            else if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedBy = _tenant.UserId;
            }
        }
    }

}
