using MediatR;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Application.Students.Commands;

public record DeleteStudentCommand(Guid Id) : IRequest<bool>;

public class DeleteStudentCommandHandler : IRequestHandler<DeleteStudentCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ITenantContext _tenantContext;

    public DeleteStudentCommandHandler(IApplicationDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    public async Task<bool> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
    {
        var student = await _context.Students
            .Where(s => s.TenantId == _tenantContext.TenantId && s.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (student == null) return false;

        _context.Students.Remove(student);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
