using Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Persistence.Core.Configurations;
public class CampusConfiguration : IEntityTypeConfiguration<Campus>
{
    public void Configure(EntityTypeBuilder<Campus> builder)
    {
        builder.ToTable("campuses", "core");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(150);
        builder.Property(c => c.Address).HasMaxLength(500);
        builder.Property(c => c.IsActive).HasDefaultValue(true);

        builder.HasOne(c => c.Tenant)
               .WithMany(t => t.Campuses)
               .HasForeignKey(c => c.TenantId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => new { c.TenantId, c.Name }).IsUnique();
    }
}

