using Application.DTO.Core;
using Application.Interface;
using Application.Interfaces.Academic;
using Dapper;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using static Dapper.SqlMapper;

namespace Infrastructure.Data.Repository.Dapper.Core;

public class CampusReadRepository : ICampusReadRepository
{
    private readonly IDapperConnectionFactory _factory;
    private readonly ITenantContext _tenant;

    public CampusReadRepository(IDapperConnectionFactory factory, ITenantContext tenant)
    {
        _factory = factory;
        _tenant = tenant;
    }

    private const string BaseSelect = @"
        SELECT id AS Id,
               tenant_id AS TenantId,
               name AS Name,
               address AS Address,
               is_active AS IsActive,
               created_at AS CreatedAt,
               updated_at AS UpdatedAt,
               created_by AS CreatedBy,
               updated_by AS UpdatedBy
        FROM core.campuses
        WHERE tenant_id = @TenantId
          AND is_deleted = false
    ";

    public async Task<CampusDto?> GetByIdAsync(Guid id, Guid? tenantId = null)
    {
        using var conn = _factory.CreateConnection();
        var sql = BaseSelect + " AND id = @Id;";
        return await conn.QueryFirstOrDefaultAsync<CampusDto>(sql, new { TenantId = tenantId ?? _tenant.TenantId, Id = id });
    }

    public async Task<IEnumerable<CampusDto>> GetByTenantAsync(Guid tenantId)
    {
        using var conn = _factory.CreateConnection();
        var sql = BaseSelect + " ORDER BY name";
        return await conn.QueryAsync<CampusDto>(sql, new { TenantId = tenantId });
    }

    public async Task<IEnumerable<CampusDto>> GetAllAsync(Guid tenantId)
    {
        return await GetByTenantAsync(tenantId);
    }
}

