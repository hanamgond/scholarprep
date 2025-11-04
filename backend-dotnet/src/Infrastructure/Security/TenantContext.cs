using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ScholarPrep.Infrastructure.Security;

public interface ITenantContext
{
    Guid TenantId { get; }
    string TenantName { get; }
}

public class TenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid TenantId
    {
        get
        {
            var tenantId = _httpContextAccessor.HttpContext?.User?.FindFirst("tenant_id")?.Value;
            return Guid.TryParse(tenantId, out var id) ? id : Guid.Empty;
        }
    }

    public string TenantName => _httpContextAccessor.HttpContext?.User?.FindFirst("tenant_name")?.Value ?? string.Empty;
}
