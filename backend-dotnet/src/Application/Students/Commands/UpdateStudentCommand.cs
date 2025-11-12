using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Application.Students.DTOs;
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Application.Students.Commands;

public record UpdateStudentCommand : IRequest<StudentDto?>
{
    public Guid Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public DateOnly DateOfBirth { get; init; }
    public Guid CampusId { get; init; }
}

public class UpdateStudentCommandHandler : IRequestHandler<UpdateStudentCommand, StudentDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public UpdateStudentCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<StudentDto?> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = await _context.Students
            .Where(s => s.TenantId == _tenantContext.TenantId && s.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (student == null) return null;

        student.FirstName = request.FirstName;
        student.LastName = request.LastName;
        student.Email = request.Email;
        student.Phone = request.Phone;
        student.DateOfBirth = request.DateOfBirth;
        student.CampusId = request.CampusId;

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
}
