namespace ScholarPrep.Shared.Interfaces;

public interface ITenantContext
{
    Guid TenantId { get; }
    string TenantName { get; }
}
