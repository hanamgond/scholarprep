using Domain.Academic.Entities;
using Domain.Enums.Academic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Persistence.Academic.Configuration;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("students", "academic");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.FirstName).IsRequired().HasMaxLength(120);
        builder.Property(s => s.LastName).HasMaxLength(120);
        builder.Property(s => s.AdmissionNo).IsRequired().HasMaxLength(50);
        builder.Property(s => s.Email).HasMaxLength(200);
        builder.Property(s => s.Status).HasDefaultValue(StudentStatus.Active);

        builder.HasOne(s => s.Section)
               .WithMany(sec => sec.Students)
               .HasForeignKey(s => s.SectionId)
               .OnDelete(DeleteBehavior.Restrict);

        //builder.HasOne(s => s.Campus)
        //        .WithMany()
        //        .HasForeignKey(s => s.CampusId)
        //        .OnDelete(DeleteBehavior.Restrict);


        // ClassId & CampusId as simple FK columns; ensure consistency in app logic
        builder.HasIndex(s => new { s.TenantId, s.AdmissionNo }).IsUnique();
    }
}

