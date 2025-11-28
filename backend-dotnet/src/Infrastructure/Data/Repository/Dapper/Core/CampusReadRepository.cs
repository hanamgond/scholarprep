using Application.DTO.Core;
using Application.Interfaces.Academic;
using Dapper;
using Infrastructure.Data.Repository.Dapper.Core.Interface;

namespace Infrastructure.Data.Repository.Dapper.Core;

public class CampusReadRepository : ICampusReadRepository
{
    private readonly IDapperConnectionFactory _factory;

    public CampusReadRepository(IDapperConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<IEnumerable<CampusDto>> GetByTenantAsync(Guid tenantId)
    {
        var sql = @"
            SELECT id, name, address, is_active
            FROM core.campuses
            WHERE tenant_id = @TenantId
            ORDER BY name;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<CampusDto>(sql, new { TenantId = tenantId });
    }
}

