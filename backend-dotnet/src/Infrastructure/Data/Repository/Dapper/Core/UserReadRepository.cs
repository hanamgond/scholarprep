using Application.DTO.Core;
using Application.Interfaces.Academic;
using Dapper;
using Infrastructure.Data.Repository.Dapper.Core.Interface;

namespace Infrastructure.Data.Repository.Dapper.Core;

public class UserReadRepository : IUserReadRepository
{
    private readonly IDapperConnectionFactory _factory;

    public UserReadRepository(IDapperConnectionFactory factory)
    {
        _factory = factory;
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        const string sql = @"
            SELECT id, tenant_id AS TenantId, campus_id AS CampusId, email, first_name AS FirstName,
                   last_name AS LastName, role, is_active AS IsActive
            FROM core.users
            WHERE email = @Email;
        ";

        using var c = _factory.CreateConnection();
        return await c.QueryFirstOrDefaultAsync<UserDto>(sql, new { Email = email });
    }
}

