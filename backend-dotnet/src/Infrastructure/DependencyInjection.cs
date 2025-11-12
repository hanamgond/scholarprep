using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ScholarPrep.Infrastructure.Data;
using ScholarPrep.Infrastructure.Interceptors;
using ScholarPrep.Shared.Interfaces;
using ScholarPrep.Infrastructure.Services; // 👈 1. ADD THIS 'using' STATEMENT

namespace ScholarPrep.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        // 2. Register HttpContextAccessor to access the current request
        services.AddHttpContextAccessor();
        
        // 3. Register your new TenantContext as the implementation for ITenantContext
        //    This tells the DI container what to provide when ITenantContext is requested.
        services.AddScoped<ITenantContext, TenantContext>();

        // Register your interceptor (which also needs ITenantContext)
        services.AddScoped<TenantInterceptor>();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IApplicationDbContext>(provider => 
            provider.GetRequiredService<ApplicationDbContext>());
        
        return services;
    }
}