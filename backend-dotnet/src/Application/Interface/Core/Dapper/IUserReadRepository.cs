using Application.DTO.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.Dapper.Core.Interface;

public interface IUserReadRepository
{
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<IEnumerable<UserDto>> GetByTenantAsync(Guid tenantId);
    Task<IEnumerable<UserDto>> GetByCampusAsync(Guid campusId);
}

