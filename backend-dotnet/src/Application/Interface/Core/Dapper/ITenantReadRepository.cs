using Application.DTO.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.Dapper.Core.Interface;

public interface ITenantReadRepository
{
    Task<IEnumerable<TenantDto>> GetAllAsync();
}
