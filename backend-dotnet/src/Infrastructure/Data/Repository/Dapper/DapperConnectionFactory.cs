using Application.Interfaces.Academic;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Data;


namespace Infrastructure.Data.Repository.Dapper;


public class DapperConnectionFactory : IDapperConnectionFactory
{
    private readonly string _connectionString;

    public DapperConnectionFactory(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection");
    }

    public IDbConnection CreateConnection() =>
        new NpgsqlConnection(_connectionString);
}

