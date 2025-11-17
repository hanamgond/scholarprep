using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScholarPrep.Shared.Interfaces;
using ScholarPrep.Application.Classes.Commands;
using ScholarPrep.Application.Classes.Queries;
// 👇 1. ADD THIS 'USING' STATEMENT
using ScholarPrep.Application.Classes.DTOs; 

namespace ScholarPrep.API.Controllers;

// 2. REMOVE THE 'SectionDto' AND 'ClassDto' DEFINITIONS FROM HERE
//    (They are now in their own files)

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClassesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClassesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // This handles: GET /api/classes
    [HttpGet]
    public async Task<IActionResult> GetClasses()
    {
        var classes = await _mediator.Send(new GetClassesQuery());
        return Ok(classes);
    }

    // This handles: POST /api/classes
    [HttpPost]
    public async Task<ActionResult<ClassDto>> CreateClass([FromBody] CreateClassCommand command)
    {
        var classDto = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetClasses), new { id = classDto.Id }, classDto);
    }

    // This handles: PATCH /api/classes/{id}
    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<ClassDto>> UpdateClass(Guid id, [FromBody] UpdateClassCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID in URL does not match ID in body.");
        }
        
        try
        {
            var updatedClass = await _mediator.Send(command);
            return Ok(updatedClass);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
    }
}