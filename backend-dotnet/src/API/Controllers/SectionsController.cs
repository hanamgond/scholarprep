using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScholarPrep.Application.Classes.DTOs; // Re-using SectionDto
using ScholarPrep.Application.Sections.Commands;
using ScholarPrep.Application.Sections.DTOs;
using ScholarPrep.Application.Sections.Queries;

namespace ScholarPrep.API.Controllers;

[ApiController]
// 👇 THIS IS THE FIX 👇
[Route("api/sections")] // Make the route explicit
[Authorize]
public class SectionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SectionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // This method handles: POST /api/sections
    [HttpPost]
    public async Task<ActionResult<SectionDto>> CreateSection([FromBody] CreateSectionCommand command)
    {
        try
        {
            var sectionDto = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetSection), new { id = sectionDto.Id }, sectionDto);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message); // e.g., if the ClassId was invalid
        }
    }
    
    // This handles: GET /api/sections/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SectionDetailsDto>> GetSection(Guid id)
    {
        var query = new GetSectionByIdQuery(id);
        var section = await _mediator.Send(query);

        return section != null ? Ok(section) : NotFound();
    }
    
    // This handles: PATCH /api/sections/{id}
    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<SectionDto>> UpdateSection(Guid id, [FromBody] UpdateSectionCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest("ID in URL does not match ID in body.");
        }
        
        try
        {
            var updatedSection = await _mediator.Send(command);
            return Ok(updatedSection);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
    }
}