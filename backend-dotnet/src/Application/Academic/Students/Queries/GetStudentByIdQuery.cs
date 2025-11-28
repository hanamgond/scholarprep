using Application.Academic.Students.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Shared.Interfaces;

namespace Application.Academic.Students.Queries;

public record GetStudentByIdQuery(Guid Id) : IRequest<StudentDto?>;

public class GetStudentByIdQueryHandler : IRequestHandler<GetStudentByIdQuery, StudentDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public GetStudentByIdQueryHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<StudentDto?> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Students
            .Where(s => s.TenantId == _tenantContext.TenantId && s.Id == request.Id)
            .Include(s => s.Campus)
            .Select(s => new StudentDto
            {
                Id = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                AdmissionNo = s.AdmissionNo,
                Email = s.Email,
                Phone = s.Phone,
                DateOfBirth = s.DateOfBirth,
                CampusId = s.CampusId,
                CampusName = s.Campus.Name,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
