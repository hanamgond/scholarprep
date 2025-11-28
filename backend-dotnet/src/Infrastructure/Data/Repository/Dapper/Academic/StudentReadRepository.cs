using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Dapper;

namespace Infrastructure.Data.Repository.Dapper.Academic;

public class StudentReadRepository : IStudentReadRepository
{
    private readonly IDapperConnectionFactory _factory;
    private readonly ITenantContext _tenant;

    public StudentReadRepository(IDapperConnectionFactory factory, ITenantContext tenant)
    {
        _factory = factory;
        _tenant = tenant;
    }

    public async Task<IEnumerable<StudentDto>> GetByClassSectionAsync(Guid classId, Guid sectionId)
    {
        var sql = @"
            SELECT id, first_name, last_name, admission_no, email
            FROM academic.students
            WHERE class_id = @ClassId
              AND section_id = @SectionId
              AND tenant_id = @TenantId
              AND campus_id = @CampusId
            ORDER BY first_name";

        using var conn = _factory.CreateConnection();

        return await conn.QueryAsync<StudentDto>(sql, new
        {
            ClassId = classId,
            SectionId = sectionId,
            _tenant.TenantId,
            _tenant.CampusId
        });
    }

    public async Task<IEnumerable<StudentDto>> GetByCampusAsync(Guid campusId)
    {
        var sql = @"
            SELECT id, first_name, last_name, admission_no, email
            FROM academic.students
            WHERE tenant_id = @TenantId
              AND campus_id = @CampusId
            ORDER BY first_name";

        using var conn = _factory.CreateConnection();

        return await conn.QueryAsync<StudentDto>(sql, new
        {
            _tenant.TenantId,
            _tenant.CampusId
        });
    }
}


