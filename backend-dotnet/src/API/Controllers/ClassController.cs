using Application.DTO.Academic;
using Application.Services.Classes.Commands;
using Application.Services.Classes.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers;


    [ApiController]
    [Route("api/[controller]")]
    public class ClassController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClassController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // --------------------------------------------------------------------
        // GET: /api/class/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // --------------------------------------------------------------------
        [HttpGet("{id:guid}")]
        [Authorize(Policy = "ClassRead")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetClassByIdQuery(id));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // GET: /api/class/campus/{campusId}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin cannot read other campuses (handled in handler)
        // --------------------------------------------------------------------
        [HttpGet("campus/{campusId:guid}")]
        [Authorize(Policy = "ClassRead")]
        public async Task<IActionResult> GetByCampus(Guid campusId)
        {
            var result = await _mediator.Send(new GetClassesByCampusQuery(campusId));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // POST: /api/class
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin CANNOT create a class for another campus (checked in handler)
        // --------------------------------------------------------------------
        [HttpPost]
        [Authorize(Policy = "ClassWrite")]
        public async Task<IActionResult> Create([FromBody] CreateClassDto dto)
        {
            var result = await _mediator.Send(new CreateClassCommand(dto));
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // --------------------------------------------------------------------
        // PUT: /api/class/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // CampusAdmin cannot update other campus classes (checked in handler)
        // --------------------------------------------------------------------
        [HttpPut("{id:guid}")]
        [Authorize(Policy = "ClassWrite")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClassDto dto)
        {
            var result = await _mediator.Send(new UpdateClassCommand(id, dto));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // DELETE: /api/class/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // Soft delete implemented (CampusAdmin cannot delete other campus class)
        // --------------------------------------------------------------------
        [HttpDelete("{id:guid}")]
        [Authorize(Policy = "ClassWrite")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _mediator.Send(new DeleteClassCommand(id));
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }

