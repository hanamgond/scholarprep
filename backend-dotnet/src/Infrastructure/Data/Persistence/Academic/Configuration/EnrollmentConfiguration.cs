using Domain.Academic.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Persistence.Academic.Configuration;

public class EnrollmentConfiguration : IEntityTypeConfiguration<Enrollment>
{
    public void Configure(EntityTypeBuilder<Enrollment> builder)
    {
        builder.ToTable("enrollments", "academic");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.EnrolledAt).HasDefaultValueSql("NOW()");
        builder.Property(e => e.IsActive).HasDefaultValue(true);

        builder.HasOne(e => e.Student)
               .WithMany(s => s.Enrollments)
               .HasForeignKey(e => e.StudentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.Section)
               .WithMany(sec => sec.Enrollments)
               .HasForeignKey(e => e.SectionId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => new { e.TenantId, e.StudentId, e.SectionId }).IsUnique();
    }
}
