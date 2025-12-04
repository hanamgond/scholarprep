
using Domain.Enums.Core;

namespace Application.DTO.Core;

public record UserDto
{
    public Guid Id { get; init; }
    public Guid TenantId { get; init; }
    public Guid? CampusId { get; init; }
    public string Email { get; init; }
    public string FirstName { get; init; }
    public string LastName { get; init; }
    public UserRole Role { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public Guid CreatedBy { get; init; }
    public Guid? UpdatedBy { get; init; }
}
