using System.Collections.Generic;

namespace ScholarPrep.Application.Classes.DTOs;

public class ClassDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int StudentCount { get; set; }
    public double AvgAccuracy { get; set; }
    public List<SectionDto> Sections { get; set; } = new();
}