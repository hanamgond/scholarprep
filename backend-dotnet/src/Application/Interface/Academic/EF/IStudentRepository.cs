using Domain.Academic.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Academic;

public interface IStudentRepository
{
    Task<Student> AddAsync(Student entity);
    Task<Student?> GetByIdAsync(Guid id);
    Task UpdateAsync(Student student);
}

