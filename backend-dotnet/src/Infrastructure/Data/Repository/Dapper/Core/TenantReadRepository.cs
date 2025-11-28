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

    public async Task<IEnumerable<TenantDto>> GetAllAsync()
    {
        var sql = @"SELECT id, name, is_active FROM core.tenants ORDER BY name";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<TenantDto>(sql);
    }
}

