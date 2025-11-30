using Application.DTO.Core;
using Application.Interface;
using Application.Interfaces.Academic;
using Dapper;
using Infrastructure.Data.Repository.Dapper.Core.Interface;

namespace Infrastructure.Data.Repository.Dapper.Core;

public class UserReadRepository : IUserReadRepository
{
    private readonly IDapperConnectionFactory _f; private readonly ITenantContext _t;
    public UserReadRepository(IDapperConnectionFactory f, ITenantContext t) { _f = f; _t = t; }

    const string Base = @"
      SELECT id AS Id, tenant_id AS TenantId, campus_id AS CampusId,
             email AS Email, first_name AS FirstName, last_name AS LastName,
             role AS Role, is_active AS IsActive, created_at AS CreatedAt,
             updated_at AS UpdatedAt, created_by AS CreatedBy, updated_by AS UpdatedBy
      FROM core.users
      WHERE tenant_id = @TenantId AND is_deleted = false
    ";

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        using var c = _f.CreateConnection();
        return await c.QueryFirstOrDefaultAsync<UserDto>(Base + " AND id=@Id", new { TenantId = _t.TenantId, Id = id });
    }
    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        using var c = _f.CreateConnection();
        return await c.QueryFirstOrDefaultAsync<UserDto>(Base + " AND email=@Email", new { TenantId = _t.TenantId, Email = email });
    }
    public async Task<IEnumerable<UserDto>> GetByTenantAsync(Guid tenantId)
    {
        using var c = _f.CreateConnection();
        return await c.QueryAsync<UserDto>(Base + " ORDER BY email", new { TenantId = tenantId });
    }
    public async Task<IEnumerable<UserDto>> GetByCampusAsync(Guid campusId)
    {
        using var c = _f.CreateConnection();
        return await c.QueryAsync<UserDto>(Base + " AND campus_id=@CampusId ORDER BY email", new { TenantId = _t.TenantId, CampusId = campusId });
    }
}


