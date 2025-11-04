using Microsoft.AspNetCore.Mvc;

namespace ScholarPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly ILogger<StudentsController> _logger;

    public StudentsController(ILogger<StudentsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetStudents()
    {
        _logger.LogInformation("Getting all students");
        return Ok(new { 
            message = "Students API is working!",
            timestamp = DateTime.UtcNow,
            status = "API is ready for development",
            version = "1.0"
        });
    }

    [HttpGet("{id:guid}")]
    public IActionResult GetStudent(Guid id)
    {
        _logger.LogInformation("Getting student with ID: {StudentId}", id);
        return Ok(new { 
            id = id,
            firstName = "John",
            lastName = "Doe",
            admissionNo = "SP2024001",
            email = "john.doe@example.com"
        });
    }

    [HttpPost]
    public IActionResult CreateStudent([FromBody] CreateStudentRequest request)
    {
        _logger.LogInformation("Creating new student: {FirstName} {LastName}", request.FirstName, request.LastName);
        
        var student = new
        {
            id = Guid.NewGuid(),
            firstName = request.FirstName,
            lastName = request.LastName,
            email = request.Email,
            admissionNo = $"SP{DateTime.UtcNow:yyyyMMddHHmmss}",
            createdAt = DateTime.UtcNow
        };

        return CreatedAtAction(nameof(GetStudent), new { id = student.id }, student);
    }
}

public class CreateStudentRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
