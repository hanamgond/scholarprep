using Domain.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.EF.Core.Interface;

public interface ICampusRepository
{
    Task<Campus> AddAsync(Campus entity);
    Task<Campus?> GetByIdAsync(Guid id, Guid? tenantId = null);
    Task<List<Campus>> GetByTenantAsync(Guid tenantId);
    Task UpdateAsync(Campus entity);
    Task SoftDeleteAsync(Guid id, Guid? tenantId);
    Task HardDeleteAsync(Guid id, Guid? tenantId); // For future need
}

