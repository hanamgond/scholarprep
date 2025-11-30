using Application.Interface;
using Application.Interface.Core.EF;
using Application.Interface.Security;
using Application.Interfaces.Academic;
using Domain.Enums.Core;
using Infrastructure.Authorization;
using Infrastructure.Authorization.Enrollment;
using Infrastructure.Data.Persistence.Academic;
using Infrastructure.Data.Persistence.Core;
using Infrastructure.Data.Repository.Dapper;
using Infrastructure.Data.Repository.Dapper.Academic;
using Infrastructure.Data.Repository.Dapper.Core;
using Infrastructure.Data.Repository.Dapper.Core.Interface;
using Infrastructure.Data.Repository.EF.Academic;
using Infrastructure.Data.Repository.EF.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using Infrastructure.Helper;
using Infrastructure.Multitenancy;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ScholarPrep.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        // 2. Register HttpContextAccessor to access the current request
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        // 3. Register your new TenantContext as the implementation for ITenantContext
        //    This tells the DI container what to provide when ITenantContext is requested.
        services.AddScoped<ITenantContext, TenantContext>();


        services.AddDbContext<CoreDbContext>(options =>
            options.UseNpgsql(connectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory", "core")
                             ).UseSnakeCaseNamingConvention());

        services.AddDbContext<AcademicDbContext>(options =>
           options.UseNpgsql(connectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory", "academic")
                            ).UseSnakeCaseNamingConvention());


        // EF Repositories
        services.AddScoped<IClassRepository, ClassRepository>();
        services.AddScoped<ISectionRepository, SectionRepository>();
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();

        //Core
        services.AddScoped<ITenantRepository, TenantRepository>();
        services.AddScoped<ICampusRepository, CampusRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();

        // Dapper Repositories
        services.AddSingleton<IDapperConnectionFactory, DapperConnectionFactory>();
        services.AddScoped<IClassReadRepository, ClassReadRepository>();
        services.AddScoped<ISectionReadRepository, SectionReadRepository>();
        services.AddScoped<IStudentReadRepository, StudentReadRepository>();
        services.AddScoped<IEnrollmentReadRepository, EnrollmentReadRepository>();

        //core
        services.AddSingleton<IDapperConnectionFactory, DapperConnectionFactory>();
        services.AddScoped<ITenantReadRepository, TenantReadRepository>();
        services.AddScoped<ICampusReadRepository, CampusReadRepository>();
        services.AddScoped<IUserReadRepository, UserReadRepository>();

        //Authorization
        services.AddScoped<IAuthorizationHandler, CampusRequirementHandler>();
        services.AddScoped<IAuthorizationHandler, EnrollmentReadAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, EnrollmentWriteAuthorizationHandler>();
        services.AddSingleton<IPasswordHasher, BcryptPasswordHasher>();

        //Token
        services.AddSingleton<ITokenService, TokenService>();


        services.AddAuthorization(options =>
        {
            options.AddPolicy("CampusMatch", p => p.RequireAuthenticatedUser().AddRequirements(new CampusRequirement()));
            options.AddPolicy("EnrollmentRead", p =>
            {
                p.RequireRole(
                    UserRole.SuperAdmin.ToString(),
                    UserRole.TenantAdmin.ToString(),
                    UserRole.CampusAdmin.ToString(),
                    UserRole.Teacher.ToString()
                );
                p.AddRequirements(new EnrollmentReadRequirement());
            });

            options.AddPolicy("EnrollmentWrite", p =>
            {
                p.RequireRole(
                    UserRole.SuperAdmin.ToString(),
                    UserRole.TenantAdmin.ToString(),
                    UserRole.CampusAdmin.ToString()
                );
                p.AddRequirements(new EnrollmentWriteRequirement());
            });
        });


        return services;
    }
}