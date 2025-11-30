using Application.DTO.Core;
using Application.Services.Campuses.Commands;
using Application.Services.Campuses.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Core;


[ApiController]
[Route("api/[controller]")]
public class CampusController : ControllerBase
{
    private readonly IMediator _mediator;

    public CampusController(IMediator mediator) => _mediator = mediator;

    [HttpGet("{id:guid}")]
    [Authorize(Policy = "CampusRead")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetCampusByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("tenant/{tenantId:guid}")]
    [Authorize(Policy = "CampusRead")]
    public async Task<IActionResult> GetByTenant(Guid tenantId)
    {
        var result = await _mediator.Send(new GetCampusesByTenantQuery(tenantId));
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Policy = "CampusRead")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllCampusesQuery());
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "CampusWrite")]
    public async Task<IActionResult> Create([FromBody] CreateCampusDto dto)
    {
        var result = await _mediator.Send(new CreateCampusCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "CampusWrite")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCampusDto dto)
    {
        var result = await _mediator.Send(new UpdateCampusCommand(id, dto));
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "CampusWrite")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _mediator.Send(new DeleteCampusCommand(id));
        if (!deleted) return NotFound();
        return NoContent();
    }
}
