using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ScholarPrep.Infrastructure.Data;
using ScholarPrep.Infrastructure.Interceptors;
using ScholarPrep.Infrastructure.Security;

namespace ScholarPrep.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Add Database Context
        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            options.UseNpgsql(connectionString);
            
            // Add interceptors
            var tenantInterceptor = sp.GetRequiredService<TenantInterceptor>();
            options.AddInterceptors(tenantInterceptor);
        });

        // Add Tenant Services
        services.AddScoped<ITenantContext, TenantContext>();
        services.AddScoped<TenantInterceptor>();
        services.AddHttpContextAccessor();

        return services;
    }
}
