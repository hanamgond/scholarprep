using Domain.Academic.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Persistence.Academic.Configuration;

public class ClassConfiguration : IEntityTypeConfiguration<Class>
{
    public void Configure(EntityTypeBuilder<Class> builder)
    {
        builder.ToTable("classes", "academic");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(150);

        builder.Property(c => c.CampusId)
               .IsRequired();

        builder.HasIndex(c => new { c.TenantId, c.CampusId, c.Name }).IsUnique();

        // Configure the Sections relationship
        builder.HasMany(c => c.Sections)
               .WithOne() // Assuming Section has navigation back to Class
               .HasForeignKey(s => s.ClassId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

