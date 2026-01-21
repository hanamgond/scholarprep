using Domain.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.EF.Core.Interface;

public interface IUserRepository
{
    Task<User> AddAsync(User entity);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task UpdateAsync(User entity);
    Task SoftDeleteAsync(Guid id);
    Task HardDeleteAsync(Guid id); // optional purge
    Task<List<User>> GetByTenantAsync(Guid tenantId);
    Task<List<User>> GetByCampusAsync(Guid campusId);
}

