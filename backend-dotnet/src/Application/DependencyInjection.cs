using Application.Mappings;
using Application.Services.Classes.Handlers;
using Application.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace ScholarPrep.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register MediatR
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
        });
        services.AddAutoMapper(typeof(MappingProfile).Assembly);

        return services;
    }
}
