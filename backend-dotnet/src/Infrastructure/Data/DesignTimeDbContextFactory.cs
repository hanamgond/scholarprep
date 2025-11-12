using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ScholarPrep.Infrastructure.Interceptors;
using ScholarPrep.Shared.Interfaces;

namespace ScholarPrep.Infrastructure.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../API"))
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        optionsBuilder.UseNpgsql(connectionString);

        // For design-time, we don't have HttpContext, so use a mock tenant interceptor
        return new ApplicationDbContext(optionsBuilder.Options, new TenantInterceptor(new MockTenantContext()));
    }

    private class MockTenantContext : ITenantContext
    {
        public Guid TenantId => Guid.Empty;
        public string TenantName => string.Empty;
    }
}
