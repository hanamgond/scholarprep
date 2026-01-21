using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Dapper;

namespace Infrastructure.Data.Repository.Dapper.Academic;

public class SectionReadRepository : ISectionReadRepository
{
    private readonly IDapperConnectionFactory _factory;
    private readonly ITenantContext _tenant;

    public SectionReadRepository(IDapperConnectionFactory factory, ITenantContext tenant)
    {
        _factory = factory;
        _tenant = tenant;
    }

    public async Task<IEnumerable<SectionDto>> GetSectionsByClassAsync(Guid classId)
    {
        var sql = @"
            SELECT id, name 
            FROM academic.sections
            WHERE class_id = @ClassId
              AND tenant_id = @TenantId
              AND campus_id = @CampusId
            ORDER BY name";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<SectionDto>(sql, new
        {
            ClassId = classId,
            _tenant.TenantId,
            _tenant.CampusId
        });
    }
}

