using Application.Interface;
using Domain.Enums.Core;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Multitenancy
{
    public class TenantContext : ITenantContext
    {
        public Guid TenantId { get; private set; }
        public Guid CampusId { get; private set; }
        public UserRole Role { get; private set; }

        public Guid UserId { get; private set; }

        public TenantContext(IHttpContextAccessor accessor)
        {
            var user = accessor.HttpContext?.User;

            TenantId = Guid.Parse(user?.FindFirst("tenantId")?.Value ?? Guid.Empty.ToString());
            CampusId = Guid.Parse(user?.FindFirst("campusId")?.Value ?? Guid.Empty.ToString());
            Role = Enum.TryParse<UserRole>(user?.FindFirst(ClaimTypes.Role)?.Value, out var r)
                                           ? r : UserRole.Student;
            UserId = Guid.TryParse(user?.FindFirst("userId")?.Value, out var u) ? u : Guid.Empty;
        }

        

        

    }
}
