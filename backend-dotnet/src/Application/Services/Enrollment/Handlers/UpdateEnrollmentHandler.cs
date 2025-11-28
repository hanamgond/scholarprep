using Application.DTO.Academic;
using Application.Interface;
using Application.Interfaces.Academic;
using Application.Services.Enrollment.Commands;
using Domain.Enums.Core;
using MediatR;

namespace Application.Services.Enrollment.Handlers;

public class UpdateEnrollmentHandler : IRequestHandler<UpdateEnrollmentCommand, EnrollmentDto>
{
    private readonly IEnrollmentRepository _efRepo;
    private readonly IEnrollmentReadRepository _readRepo;
    private readonly IStudentRepository _studentRepo;
    private readonly IClassRepository _classRepo;
    private readonly ISectionRepository _sectionRepo;
    private readonly ITenantContext _tenant;

    public UpdateEnrollmentHandler(
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

    public async Task<EnrollmentDto> Handle(UpdateEnrollmentCommand request, CancellationToken ct)
    {
        // Load enrollment
        var enrollment = await _efRepo.GetByIdAsync(request.EnrollmentId)
                         ?? throw new KeyNotFoundException("Enrollment not found.");

        if (enrollment.TenantId != _tenant.TenantId)
            throw new UnauthorizedAccessException();

        // Roles restrictions
        if (_tenant.Role is UserRole.Teacher or UserRole.Student)
            throw new UnauthorizedAccessException();

        if (_tenant.Role == UserRole.CampusAdmin &&
            enrollment.CampusId != _tenant.CampusId)
            throw new UnauthorizedAccessException("Cannot update enrollment outside campus.");

        var student = await _studentRepo.GetByIdAsync(enrollment.StudentId)
                      ?? throw new Exception("Student not found");

        var @class = await _classRepo.GetByIdAsync(request.Dto.ClassId)
                      ?? throw new Exception("Class not found");

        var section = await _sectionRepo.GetByIdAsync(request.Dto.SectionId)
                       ?? throw new Exception("Section not found");

        // ensure section belongs to class
        if (section.ClassId != @class.Id)
            throw new Exception("Invalid section for the given class.");

        // Update
        enrollment.ClassId = @class.Id;
        enrollment.SectionId = section.Id;
        enrollment.IsActive = request.Dto.IsActive;
        enrollment.UpdatedAt = DateTime.UtcNow;
        enrollment.UpdatedBy = _tenant.UserId;

        await _efRepo.UpdateAsync(enrollment);

        return await _readRepo.GetByIdAsync(enrollment.Id)
               ?? throw new Exception("Updated enrollment read failed.");
    }
}
