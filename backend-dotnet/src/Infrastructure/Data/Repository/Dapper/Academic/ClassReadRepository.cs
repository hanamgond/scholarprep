using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Dapper;
using Infrastructure.Multitenancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data.Repository.Dapper.Academic;

public class ClassReadRepository : IClassReadRepository
{
    private readonly IDapperConnectionFactory _factory;
    private readonly ITenantContext _tenant;

    public ClassReadRepository(IDapperConnectionFactory factory, ITenantContext tenant)
    {
        _factory = factory;
        _tenant = tenant;
    }

    public async Task<ClassDto?> GetByIdAsync(Guid id)
    {
        const string sql = @"
            SELECT id AS Id,
                   tenant_id AS TenantId,
                   campus_id AS CampusId,
                   name AS Name,
                   is_active AS IsActive,
                   created_at AS CreatedAt,
                   updated_at AS UpdatedAt,
                   created_by AS CreatedBy,
                   updated_by AS UpdatedBy
            FROM academic.classes
            WHERE id = @Id AND tenant_id = @TenantId AND is_deleted = false;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<ClassDto>(sql, new { Id = id, TenantId = _tenant.TenantId });
    }

    public async Task<IEnumerable<ClassDto>> GetByCampusAsync(Guid campusId)
    {
        const string sql = @"
            SELECT id AS Id,
                   tenant_id AS TenantId,
                   campus_id AS CampusId,
                   name AS Name,
                   is_active AS IsActive,
                   created_at AS CreatedAt,
                   updated_at AS UpdatedAt,
                   created_by AS CreatedBy,
                   updated_by AS UpdatedBy
            FROM academic.classes
            WHERE tenant_id = @TenantId
              AND campus_id = @CampusId
              AND is_deleted = false
            ORDER BY name;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<ClassDto>(sql, new { TenantId = _tenant.TenantId, CampusId = campusId });
    }

    public async Task<IEnumerable<ClassDto>> GetByTenantAsync(Guid tenantId)
    {
        const string sql = @"
            SELECT id AS Id,
                   tenant_id AS TenantId,
                   campus_id AS CampusId,
                   name AS Name,
                   is_active AS IsActive,
                   created_at AS CreatedAt,
                   updated_at AS UpdatedAt,
                   created_by AS CreatedBy,
                   updated_by AS UpdatedBy
            FROM academic.classes
            WHERE tenant_id = @TenantId AND is_deleted = false
            ORDER BY name;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<ClassDto>(sql, new { TenantId = tenantId });
    }

    public async Task<IEnumerable<ClassDto>> GetAllAsync(Guid tenantId)
    {
        return await GetByTenantAsync(tenantId);
    }
}
