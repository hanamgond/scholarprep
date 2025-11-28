using Application.Academic.Students.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Academic.Entities;

namespace Application.Academic.Students.Commands;

// 1. UPDATE THE COMMAND TO MATCH YOUR FORM
public record CreateStudentCommand : IRequest<StudentDto>
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public DateOnly DateOfBirth { get; init; }
    public Guid CampusId { get; init; }
    
    // --- ADD ALL THE NEW FIELDS ---
    public string? RollNumber { get; init; }
    public string? Gender { get; init; }
    public string? FatherName { get; init; }
    public string? FatherMobile { get; init; }
    public string? MotherName { get; init; }
    public string? MotherMobile { get; init; }
    public string? Address { get; init; }
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
        // 2. MAP THE NEW FIELDS TO THE ENTITY
        var student = new Student
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            DateOfBirth = request.DateOfBirth,
            CampusId = request.CampusId,
            TenantId = _tenantContext.TenantId,
            AdmissionNo = GenerateAdmissionNo(),
            
            // --- ADD THE MAPPINGS ---
            RollNumber = request.RollNumber,
            Gender = request.Gender,
            FatherName = request.FatherName,
            FatherMobile = request.FatherMobile,
            MotherName = request.MotherName,
            MotherMobile = request.MotherMobile,
            Address = request.Address
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
            // Note: You can add the new fields to StudentDto as well
            // if you want them returned to the frontend right after creation.
        };
    }

    private string GenerateAdmissionNo()
    {
        return $"SP{DateTime.UtcNow:yyyyMMddHHmmss}";
    }
}