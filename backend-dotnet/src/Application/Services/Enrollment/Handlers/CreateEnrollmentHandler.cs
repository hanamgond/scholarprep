using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Commands;
using Domain.Enums.Core;
using MediatR;
using Domain.Academic.Entities;

namespace Application.Services.Enrollment.Handlers;


public class CreateEnrollmentHandler : IRequestHandler<CreateEnrollmentCommand, EnrollmentDto>
{
    private readonly IEnrollmentRepository _efRepo;
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly IStudentRepository _studentRepo;
    private readonly IClassRepository _classRepo;
    private readonly ISectionRepository _sectionRepo;
    private readonly ITenantContext _tenant;

    public CreateEnrollmentHandler(
        IEnrollmentRepository efRepo,
        IEnrollmentReadRepository readRepo,
        IStudentRepository studentRepo,
        IClassRepository classRepo,
        ISectionRepository sectionRepo,
        ITenantContext tenant)
    {
        _efRepo = efRepo;
        _readRepo = readRepo;
        _studentRepo = studentRepo;
        _classRepo = classRepo;
        _sectionRepo = sectionRepo;
        _tenant = tenant;
    }

    public async Task<EnrollmentDto> Handle(CreateEnrollmentCommand request, CancellationToken ct)
    {
        var dto = request.Dto;

        // -----------------------------
        // ROLE CHECK
        // -----------------------------
        if (_tenant.Role is UserRole.Teacher or UserRole.Student)
            throw new UnauthorizedAccessException();

        // -----------------------------
        // LOAD DOMAIN ENTITIES
        // -----------------------------
        var student = await _studentRepo.GetByIdAsync(dto.StudentId)
                      ?? throw new KeyNotFoundException("Student not found.");

        var @class = await _classRepo.GetByIdAsync(dto.ClassId)
                     ?? throw new KeyNotFoundException("Class not found.");

        var section = await _sectionRepo.GetByIdAsync(dto.SectionId)
                      ?? throw new KeyNotFoundException("Section not found.");

        // -----------------------------
        // DOMAIN VALIDATIONS
        // -----------------------------

        // 1) Tenant must match
        if (student.TenantId != _tenant.TenantId ||
            @class.TenantId != _tenant.TenantId ||
            section.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException("Tenant mismatch.");

        // 2) Campus must match
        if (student.CampusId != @class.CampusId ||
            student.CampusId != section.CampusId)
            throw new Exception("Student, class, and section must be in same campus.");

        // CampusAdmin restriction enforced here
        if (_tenant.Role == UserRole.CampusAdmin &&
            @class.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("CampusAdmin cannot enroll outside their campus.");

        // 3) Section must belong to the class
        if (section.ClassId != @class.Id)
            throw new Exception("Section does not belong to the specified class.");

        // 4) Prevent duplicate active enrollment
        var existing = await _efRepo.GetByStudentAsync(dto.StudentId);
        if (existing.Any(e => e.IsActive))
            throw new Exception("Student already has an active enrollment.");

        // -----------------------------
        // CREATE ENROLLMENT
        // -----------------------------
        var entity = new Domain.Academic.Entities.Enrollment
        {
            TenantId = _tenant.TenantId,
            CampusId = student.CampusId,
            StudentId = dto.StudentId,
            ClassId = dto.ClassId,
            SectionId = dto.SectionId,
            EnrolledAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = _tenant.UserId,
            IsActive = true
        };

        var created = await _efRepo.AddAsync(entity);

        return await _readRepo.GetByIdAsync(created.Id)
               ?? throw new Exception("Enrollment created but Dapper read failed.");
    }
}
