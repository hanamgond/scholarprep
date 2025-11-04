using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScholarPrep.Domain.Entities;

namespace ScholarPrep.Infrastructure.Data.Configurations;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.FirstName)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(s => s.LastName)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(s => s.AdmissionNo)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(s => s.Email)
            .HasMaxLength(255);
            
        builder.Property(s => s.Phone)
            .HasMaxLength(20);

        // Unique constraint per tenant
        builder.HasIndex(s => new { s.TenantId, s.AdmissionNo })
            .IsUnique();

        // Relationships
        builder.HasOne(s => s.Tenant)
            .WithMany(t => t.Students)
            .HasForeignKey(s => s.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
            
        builder.HasOne(s => s.Campus)
            .WithMany(c => c.Students)
            .HasForeignKey(s => s.CampusId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
