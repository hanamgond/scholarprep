using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Students.DTOs;
using ScholarPrep.Domain.Entities;
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Application.Students.Commands;

public record CreateStudentCommand : IRequest<StudentDto>
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public DateOnly DateOfBirth { get; init; }
    public Guid CampusId { get; init; }
}

public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, StudentDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CreateStudentCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<StudentDto> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = new Student
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            DateOfBirth = request.DateOfBirth,
            CampusId = request.CampusId,
            TenantId = _tenantContext.TenantId,
            AdmissionNo = GenerateAdmissionNo()
        };

        _context.Students.Add(student);
        await _context.SaveChangesAsync(cancellationToken);

        // Load campus name for response
        var campus = await _context.Campuses
            .Where(c => c.Id == student.CampusId && c.TenantId == _tenantContext.TenantId)
            .FirstOrDefaultAsync(cancellationToken);

        return new StudentDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            AdmissionNo = student.AdmissionNo,
            Email = student.Email,
            Phone = student.Phone,
            DateOfBirth = student.DateOfBirth,
            CampusId = student.CampusId,
            CampusName = campus?.Name ?? string.Empty,
            CreatedAt = student.CreatedAt,
            UpdatedAt = student.UpdatedAt
        };
    }

    private string GenerateAdmissionNo()
    {
        return $"SP{DateTime.UtcNow:yyyyMMddHHmmss}";
    }
}
