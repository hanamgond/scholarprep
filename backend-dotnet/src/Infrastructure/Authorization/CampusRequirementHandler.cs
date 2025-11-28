using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Authorization;

public class CampusRequirementHandler : AuthorizationHandler<CampusRequirement>
{ 
    private readonly IHttpContextAccessor _accessor;

    public CampusRequirementHandler(IHttpContextAccessor accessor)
    {
        _accessor = accessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CampusRequirement requirement)
    {
        var user = _accessor.HttpContext?.User;
        if (user == null) { context.Fail(); return Task.CompletedTask; }
        var campusClaim = user?.FindFirst("campusId")?.Value;

        if (string.IsNullOrEmpty(campusClaim))
        {
            context.Fail();
            return Task.CompletedTask;
        }

        // Try read campusId from route values
        var route = _accessor.HttpContext?.GetRouteData();
        if (route?.Values.TryGetValue("campusId", out var campusRouteVal) == true)
        {
            if (Guid.TryParse(campusRouteVal?.ToString(), out var routeCampusId) &&
                Guid.TryParse(campusClaim, out var claimCampusId) &&
                routeCampusId == claimCampusId)
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
        }

        // Alternatively, you might want to check resource passed in context.Resource (controller action model)
        context.Fail();
        return Task.CompletedTask;
    }
}
