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
    private const string BaseSelect = @"
                SELECT id AS Id,
tenant_id AS TenantId,
campus_id AS CampusId,
class_id AS ClassId,
section_id AS SectionId,
first_name AS FirstName,
last_name AS LastName,
admission_no AS AdmissionNo,
email AS Email,
phone AS Phone,
date_of_birth  AS DateOfBirth,
roll_number AS RollNumber,
gender AS Gender,
father_name AS FatherName,
father_mobile AS FatherMobile,
mother_name AS MotherName,
mother_mobile AS MotherMobile,
address AS Address,
status AS Status,
created_at AS CreatedAt,
updated_at AS UpdatedAt,
created_by AS CreatedBy,
updated_by AS UpdatedBy
            FROM academic.students
            ";

    public async Task<IEnumerable<StudentDto>> GetByClassSectionAsync(Guid classId, Guid sectionId)
    {
        var sql = BaseSelect + @"
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
        var sql = BaseSelect + @"
            WHERE tenant_id = @TenantId
              AND campus_id = @CampusId
            ORDER BY first_name";
        //var sql = @"
        //    SELECT id, first_name, last_name, admission_no, email
        //    FROM academic.students
        //    WHERE tenant_id = @TenantId
        //      AND campus_id = @CampusId
        //    ORDER BY first_name";

        using var conn = _factory.CreateConnection();

        return await conn.QueryAsync<StudentDto>(sql, new
        {
            _tenant.TenantId,
            _tenant.CampusId
        });
    }
}


