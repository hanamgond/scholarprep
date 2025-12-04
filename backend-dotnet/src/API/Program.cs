using Application.Interface.Security;
using Application.Services.Auth;
using Application.Validators;
using Domain.Enums.Core;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Authorization;
using Infrastructure.Data.Repository.EF.Core;
using Infrastructure.Data.Repository.EF.Core.Interface;
using Infrastructure.Multitenancy;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ScholarPrep.Application; 
using ScholarPrep.Infrastructure;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 👇 PASTE THIS SECTION NEAR THE TOP
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          // This is your frontend's address
                          policy.WithOrigins("http://localhost:5173") 
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// Validators
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateClassDtoValidator>();

builder.Services.AddControllers();
//                .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CreateClassDtoValidator>()); ;
// ... (rest of your services)

builder.Services.AddAuthentication(options =>
{
options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            ),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization(options =>
{
    AddPolicyService(options);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ScholarPrep API", Version = "v1" });
    // JWT Bearer config for Swagger (Authorize button)
    var bearerScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token. Example: \"Bearer {token}\"",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", bearerScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { bearerScheme, Array.Empty<string>() }
    });
});

builder.Services.AddApplication(); 
builder.Services.AddInfrastructureServices(builder.Configuration);

// Authentication
builder.Services.AddSingleton<ITokenService, TokenService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ScholarPrep API v1");
        // Serve swagger at app root so browser opens directly to it
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
static void AddPolicyService(AuthorizationOptions options)
{
    // ----------------------------
    // ROLE-BASED BASE POLICIES
    // ----------------------------

    // Full system access (used for global admin operations)
    options.AddPolicy("SuperAdminOnly", policy =>
        policy.RequireRole(UserRole.SuperAdmin.ToString()));

    // Tenant-level administration
    options.AddPolicy("TenantAdminOnly", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString()
        ));

    // Campus-level administration
    options.AddPolicy("CampusAdminOnly", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    // Teacher-level access (read-only academic access)
    options.AddPolicy("TeacherOnly", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString(),
            UserRole.Teacher.ToString()
        ));

    // StudentOnly access (restrict to student self-reading)
    options.AddPolicy("StudentOnly", policy =>
        policy.RequireRole(UserRole.Student.ToString()));

    // ----------------------------
    // FEATURE-SPECIFIC POLICIES
    // ----------------------------

    // CLASS MODULE
    options.AddPolicy("ClassRead", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    options.AddPolicy("ClassWrite", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    // SECTION MODULE
    options.AddPolicy("SectionRead", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    options.AddPolicy("SectionWrite", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    // STUDENT MODULE
    options.AddPolicy("StudentRead", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString(),
            UserRole.Teacher.ToString()
        ));

    options.AddPolicy("StudentWrite", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    // STUDENTS CAN ONLY READ THEMSELVES
    options.AddPolicy("StudentSelfRead", policy =>
        policy.RequireRole(UserRole.Student.ToString()));

    // ENROLLMENT MODULE
    options.AddPolicy("EnrollmentRead", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString(),
            UserRole.Teacher.ToString()
        ));

    options.AddPolicy("EnrollmentWrite", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    // CAMPUS MANAGEMENT
    options.AddPolicy("CampusManagement", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString()
        ));

    // TENANT MANAGEMENT (SuperAdmin only)
    options.AddPolicy("TenantManagement", policy =>
        policy.RequireRole(UserRole.SuperAdmin.ToString()));

    // CAMPUS MODULE
    options.AddPolicy("CampusRead", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

    options.AddPolicy("CampusWrite", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString()
        ));

    //User Module
    options.AddPolicy("UserWrite", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));
    
    options.AddPolicy("UserRead", policy =>
        policy.RequireRole(
            UserRole.SuperAdmin.ToString(),
            UserRole.TenantAdmin.ToString(),
            UserRole.CampusAdmin.ToString()
        ));

}

