using Application.DTO.Core;
using Application.Interfaces.Academic;
using Dapper;
using Infrastructure.Data.Repository.Dapper.Core.Interface;

namespace Infrastructure.Data.Repository.Dapper.Core;

public class TenantReadRepository : ITenantReadRepository
{
    private readonly IDapperConnectionFactory _factory;

    public TenantReadRepository(IDapperConnectionFactory factory)
    {
        _factory = factory;
    }

    private const string BaseSelect = @"
        SELECT id AS Id,
               name AS Name,
               is_active AS IsActive,
               created_at AS CreatedAt,
               updated_at AS UpdatedAt,
               created_by AS CreatedBy,
               updated_by AS UpdatedBy
        FROM core.tenants
        WHERE is_deleted = false
    ";

    public async Task<TenantDto?> GetByIdAsync(Guid id)
    {
        using var conn = _factory.CreateConnection();

        var sql = BaseSelect + " AND id = @Id";

        return await conn.QueryFirstOrDefaultAsync<TenantDto>(sql, new { Id = id });
    }

    public async Task<IEnumerable<TenantDto>> GetAllAsync()
    {
        var sql = BaseSelect + " ORDER BY name";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<TenantDto>(sql);
    }
}

