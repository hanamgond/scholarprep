namespace ScholarPrep.Application.Sections.DTOs;

// This DTO matches the 'SectionDetails' interface in your frontend
public class SectionDetailsDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ClassInfo Class { get; set; } = new();

    public class ClassInfo
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}