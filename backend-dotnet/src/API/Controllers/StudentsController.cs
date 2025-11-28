using Application.Academic.Students.Commands;
using Application.Academic.Students.DTOs;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Academic.Students.Commands;
using Application.Academic.Students.Queries;

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

    // --- THIS METHOD IS UPDATED ---
    [HttpPost]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentCommand command)
    {
        // We removed the DTO and manual mapping.
        // The command from the frontend (which matches CreateStudentCommand) 
        // is passed directly to the handler.
        _logger.LogInformation("Creating new student: {FirstName} {LastName}", 
            command.FirstName, command.LastName);
            
        var student = await _mediator.Send(command);
        
        // Return a "201 Created" status
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
    }
    // --- END OF UPDATE ---

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