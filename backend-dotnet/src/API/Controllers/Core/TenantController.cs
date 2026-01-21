using Application.DTO.Core;
using Application.Services.Tenants.Commands;
using Application.Services.Tenants.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Core;

[ApiController]
[Route("api/[controller]")]
public class TenantController : ControllerBase
{
    private readonly IMediator _mediator;

    public TenantController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:guid}")]
    [Authorize(Policy = "TenantManagement")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetTenantByIdQuery(id));
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Policy = "TenantManagement")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllTenantsQuery());
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "TenantManagement")]
    public async Task<IActionResult> Create([FromBody] CreateTenantDto dto)
    {
        var result = await _mediator.Send(new CreateTenantCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "TenantManagement")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTenantDto dto)
    {
        var result = await _mediator.Send(new UpdateTenantCommand(id, dto));
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "TenantManagement")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _mediator.Send(new DeleteTenantCommand(id));
        if (!deleted) return NotFound();

        return NoContent();
    }
}

