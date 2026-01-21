using Domain.Enums.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface ITenantContext
    {
        Guid TenantId { get; }
        Guid CampusId { get; }
        Guid UserId { get; }
        UserRole Role { get; }
    }
}
