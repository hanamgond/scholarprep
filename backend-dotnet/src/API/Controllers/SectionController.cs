using Application.DTO.Academic;
using Application.Services.Sections.Commands;
using Application.Services.Sections.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SectionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // --------------------------------------------------------------------
        // GET: /api/section/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin == only their campus (checked by handler)
        // --------------------------------------------------------------------
        [HttpGet("{id:guid}")]
        [Authorize(Policy = "SectionRead")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetSectionByIdQuery(id));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // GET: /api/section/class/{classId}
        // Get sections under a class
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin restricted to their own campus → enforced in handler
        // --------------------------------------------------------------------
        [HttpGet("class/{classId:guid}")]
        [Authorize(Policy = "SectionRead")]
        public async Task<IActionResult> GetByClass(Guid classId)
        {
            var result = await _mediator.Send(new GetSectionsByClassQuery(classId));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // POST: /api/section
        // Create a new section
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin CANNOT create a section for another campus
        // --------------------------------------------------------------------
        [HttpPost]
        [Authorize(Policy = "SectionWrite")]
        public async Task<IActionResult> Create([FromBody] CreateSectionDto dto)
        {
            var result = await _mediator.Send(new CreateSectionCommand(dto));
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // --------------------------------------------------------------------
        // PUT: /api/section/{id}
        // Update section
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin restricted to their own campus → handler enforces
        // --------------------------------------------------------------------
        [HttpPut("{id:guid}")]
        [Authorize(Policy = "SectionWrite")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSectionDto dto)
        {
            var result = await _mediator.Send(new UpdateSectionCommand(id, dto));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // DELETE: /api/section/{id}
        // Soft delete a section
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin restricted by handler
        // --------------------------------------------------------------------
        [HttpDelete("{id:guid}")]
        [Authorize(Policy = "SectionWrite")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _mediator.Send(new DeleteSectionCommand(id));

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
