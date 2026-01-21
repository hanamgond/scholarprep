using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Dapper;

namespace Infrastructure.Data.Repository.Dapper.Academic;

public class EnrollmentReadRepository : IEnrollmentReadRepository
{
    private readonly IDapperConnectionFactory _factory;
    private readonly ITenantContext _tenant;

    public EnrollmentReadRepository(IDapperConnectionFactory factory, ITenantContext tenant)
    {
        _factory = factory;
        _tenant = tenant;
    }

    private const string BaseSelect = @"
        SELECT 
            id AS Id,
            tenant_id AS TenantId,
            campus_id AS CampusId,
            student_id AS StudentId,
            class_id AS ClassId,
            section_id AS SectionId,
            enrolled_at AS EnrolledAt,
            is_active AS IsActive,
            created_at AS CreatedAt,
            updated_at AS UpdatedAt,
            created_by AS CreatedBy,
            updated_by AS UpdatedBy
        FROM academic.enrollments
    ";

    // ------------------------------------------------------------------------
    // GET BY ID
    // ------------------------------------------------------------------------
    public async Task<EnrollmentDto?> GetByIdAsync(Guid id)
    {
        var sql = BaseSelect + @"
            WHERE id = @Id
              AND tenant_id = @TenantId
              AND is_deleted = false;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<EnrollmentDto>(sql, new
        {
            Id = id,
            TenantId = _tenant.TenantId
        });
    }

    // ------------------------------------------------------------------------
    // GET BY STUDENT
    // ------------------------------------------------------------------------
    public async Task<IEnumerable<EnrollmentDto>> GetByStudentAsync(Guid studentId)
    {
        var sql = BaseSelect + @"
            WHERE student_id = @StudentId
              AND tenant_id = @TenantId
              AND is_deleted = false
            ORDER BY enrolled_at DESC;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<EnrollmentDto>(sql, new
        {
            StudentId = studentId,
            TenantId = _tenant.TenantId
        });
    }

    // ------------------------------------------------------------------------
    // GET BY CLASS
    // ------------------------------------------------------------------------
    public async Task<IEnumerable<EnrollmentDto>> GetByClassAsync(Guid classId)
    {
        var sql = BaseSelect + @"
            WHERE class_id = @ClassId
              AND tenant_id = @TenantId
              AND is_deleted = false
            ORDER BY enrolled_at DESC;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<EnrollmentDto>(sql, new
        {
            ClassId = classId,
            TenantId = _tenant.TenantId
        });
    }

    // ------------------------------------------------------------------------
    // GET BY CAMPUS
    // ------------------------------------------------------------------------
    public async Task<IEnumerable<EnrollmentDto>> GetByCampusAsync(Guid campusId)
    {
        var sql = BaseSelect + @"
            WHERE campus_id = @CampusId
              AND tenant_id = @TenantId
              AND is_deleted = false
            ORDER BY enrolled_at DESC;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<EnrollmentDto>(sql, new
        {
            CampusId = campusId,
            TenantId = _tenant.TenantId
        });
    }

    // ------------------------------------------------------------------------
    // GET ALL (Tenant Scoped)
    // ------------------------------------------------------------------------
    public async Task<IEnumerable<EnrollmentDto>> GetAllAsync(Guid tenantId)
    {
        var sql = BaseSelect + @"
            WHERE tenant_id = @TenantId
              AND is_deleted = false
            ORDER BY enrolled_at DESC;
        ";

        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<EnrollmentDto>(sql, new
        {
            TenantId = tenantId
        });
    }
}
