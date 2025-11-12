using Microsoft.AspNetCore.Http;
using ScholarPrep.Shared.Interfaces;
using System.Security.Claims;

namespace ScholarPrep.Infrastructure.Services;

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
            var tenantIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("tenantId");

            if (tenantIdClaim != null && Guid.TryParse(tenantIdClaim.Value, out var tenantId))
            {
                return tenantId;
            }
            
            // Fallback
            return Guid.Empty;
        }
    }

    // 👇 FIX: ADD THIS MISSING PROPERTY
    public string TenantName
    {
        get
        {
            var tenantNameClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("tenantName");

            if (tenantNameClaim != null && !string.IsNullOrEmpty(tenantNameClaim.Value))
            {
                return tenantNameClaim.Value;
            }

            // Fallback
            return string.Empty;
        }
    }
}