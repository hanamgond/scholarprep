using Domain.Academic.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Persistence.Academic.Configuration;

public class SectionConfiguration : IEntityTypeConfiguration<Section>
{
    public void Configure(EntityTypeBuilder<Section> builder)
    {
        builder.ToTable("sections", "academic");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(50);

        builder.HasOne(s => s.Class)
               .WithMany(c => c.Sections)
               .HasForeignKey(s => s.ClassId)
               .OnDelete(DeleteBehavior.Cascade);

        //builder.HasOne(s => s.Campus)
        //        .WithMany()
        //        .HasForeignKey(s => s.CampusId)
        //        .OnDelete(DeleteBehavior.Restrict);

        // keep campus fk and tenant fk explicit
        builder.HasIndex(s => new { s.TenantId, s.CampusId, s.ClassId, s.Name }).IsUnique();
    }
}

