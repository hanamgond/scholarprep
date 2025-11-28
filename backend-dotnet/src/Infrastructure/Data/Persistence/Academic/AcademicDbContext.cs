using Application.Interface;
using Domain.Academic.Entities;
using Infrastructure.Data.Persistence.Academic.Configuration;
using Infrastructure.Multitenancy;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Domain.Common;

namespace Infrastructure.Data.Persistence.Academic;

public class AcademicDbContext : DbContext
{
    private readonly ITenantContext _tenant;
    public AcademicDbContext(DbContextOptions<AcademicDbContext> options, ITenantContext tenant) : base(options) { _tenant = tenant; }

    public DbSet<Class> Classes { get; set; } = null!;
    public DbSet<Section> Sections { get; set; } = null!;
    public DbSet<Student> Students { get; set; } = null!;
    public DbSet<Enrollment> Enrollments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("academic");

        modelBuilder.ApplyConfiguration(new ClassConfiguration());
        modelBuilder.ApplyConfiguration(new SectionConfiguration());
        modelBuilder.ApplyConfiguration(new StudentConfiguration());
        modelBuilder.ApplyConfiguration(new EnrollmentConfiguration());

        // Global filters:
        if (_tenant?.TenantId != Guid.Empty)
        {
            modelBuilder.Entity<Class>().HasQueryFilter(c => c.TenantId == _tenant.TenantId && c.CampusId == _tenant.CampusId);
            modelBuilder.Entity<Section>().HasQueryFilter(s => s.TenantId == _tenant.TenantId && s.CampusId == _tenant.CampusId);
            modelBuilder.Entity<Student>().HasQueryFilter(s => s.TenantId == _tenant.TenantId && s.CampusId == _tenant.CampusId);
            modelBuilder.Entity<Enrollment>().HasQueryFilter(e => e.TenantId == _tenant.TenantId && e.CampusId == _tenant.CampusId);
        }

        modelBuilder.Entity<Class>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Section>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Student>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Enrollment>().HasQueryFilter(x => !x.IsDeleted);

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