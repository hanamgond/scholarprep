using Application.Interface;
using Domain.Enums.Core;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Authorization.Enrollment;

public class EnrollmentReadRequirement : IAuthorizationRequirement { }

public class EnrollmentReadAuthorizationHandler :
    AuthorizationHandler<EnrollmentReadRequirement>
{
    private readonly ITenantContext _tenant;

    public EnrollmentReadAuthorizationHandler(ITenantContext tenant)
    {
        _tenant = tenant;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        EnrollmentReadRequirement requirement)
    {
        // Roles allowed (base policy will enforce roles)
        if (_tenant.Role is UserRole.SuperAdmin or UserRole.TenantAdmin)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // CampusAdmin allowed but limited to own campus (Handlers also enforce campusId match)
        if (_tenant.Role == UserRole.CampusAdmin)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Teachers can read enrollments
        if (_tenant.Role == UserRole.Teacher)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        context.Fail();
        return Task.CompletedTask;
    }
}
