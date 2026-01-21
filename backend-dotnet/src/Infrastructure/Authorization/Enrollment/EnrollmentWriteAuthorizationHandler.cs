using Application.Interface;
using Domain.Enums.Core;
using Microsoft.AspNetCore.Authorization;

namespace Infrastructure.Authorization.Enrollment;


public class EnrollmentWriteRequirement : IAuthorizationRequirement { }

public class EnrollmentWriteAuthorizationHandler :
    AuthorizationHandler<EnrollmentWriteRequirement>
{
    private readonly ITenantContext _tenant;

    public EnrollmentWriteAuthorizationHandler(ITenantContext tenant)
    {
        _tenant = tenant;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        EnrollmentWriteRequirement requirement)
    {
        // SuperAdmin / TenantAdmin fully allowed
        if (_tenant.Role is UserRole.SuperAdmin or UserRole.TenantAdmin)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // CampusAdmin allowed but only in their own campus (checked in handlers)
        if (_tenant.Role == UserRole.CampusAdmin)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Teachers / Students cannot write
        context.Fail();
        return Task.CompletedTask;
    }
}
