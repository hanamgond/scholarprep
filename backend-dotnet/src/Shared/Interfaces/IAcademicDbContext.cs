using Domain.Academic.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Interfaces
{
    public interface IAcademicDbContext
    {
        DbSet<Student> Students { get; }
        DbSet<Class> Classes { get; }
        DbSet<Enrollment> Enrollments { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
