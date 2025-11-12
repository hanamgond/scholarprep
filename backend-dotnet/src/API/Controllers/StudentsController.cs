using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScholarPrep.Application.Students.Commands;
using ScholarPrep.Application.Students.DTOs;
using ScholarPrep.Application.Students.Queries;

namespace ScholarPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<StudentsController> _logger;

    public StudentsController(IMediator mediator, ILogger<StudentsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<StudentDto>>> GetStudents()
    {
        _logger.LogInformation("Getting all students");
        var students = await _mediator.Send(new GetStudentsQuery());
        return Ok(students);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentDto>> GetStudent(Guid id)
    {
        _logger.LogInformation("Getting student with ID: {StudentId}", id);
        var student = await _mediator.Send(new GetStudentByIdQuery(id));
        
        if (student == null)
        {
            return NotFound();
        }

        return Ok(student);
    }

    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createStudentDto)
    {
        _logger.LogInformation("Creating new student: {FirstName} {LastName}", 
            createStudentDto.FirstName, createStudentDto.LastName);

        var command = new CreateStudentCommand
        {
            FirstName = createStudentDto.FirstName,
            LastName = createStudentDto.LastName,
            Email = createStudentDto.Email,
            Phone = createStudentDto.Phone,
            DateOfBirth = createStudentDto.DateOfBirth,
            CampusId = createStudentDto.CampusId
        };

        var student = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StudentDto>> UpdateStudent(Guid id, [FromBody] UpdateStudentDto updateStudentDto)
    {
        _logger.LogInformation("Updating student with ID: {StudentId}", id);

        var command = new UpdateStudentCommand
        {
            Id = id,
            FirstName = updateStudentDto.FirstName,
            LastName = updateStudentDto.LastName,
            Email = updateStudentDto.Email,
            Phone = updateStudentDto.Phone,
            DateOfBirth = updateStudentDto.DateOfBirth,
            CampusId = updateStudentDto.CampusId
        };

        var student = await _mediator.Send(command);
        
        if (student == null)
        {
            return NotFound();
        }

        return Ok(student);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteStudent(Guid id)
    {
        _logger.LogInformation("Deleting student with ID: {StudentId}", id);
        
        var result = await _mediator.Send(new DeleteStudentCommand(id));
        
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
