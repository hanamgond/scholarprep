using Dapper;
using System.Data;

namespace Infrastructure.Helper;

public class DateOnlyHandler : SqlMapper.TypeHandler<DateOnly>
{
    public override DateOnly Parse(object value)
        => DateOnly.FromDateTime((DateTime)value);

    public override void SetValue(IDbDataParameter parameter, DateOnly value)
        => parameter.Value = value.ToDateTime(TimeOnly.MinValue);
}