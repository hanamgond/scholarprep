using Application.DTO.Core;
using Application.Services.Users;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Core;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;

    public UserController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // -------------------------------------------------------------
    // GET BY ID
    // -------------------------------------------------------------
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "UserRead")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery(id));
        return Ok(result);
    }

    // -------------------------------------------------------------
    // GET BY EMAIL
    // -------------------------------------------------------------
    [HttpGet("email/{email}")]
    [Authorize(Policy = "UserRead")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var result = await _mediator.Send(new GetUserByEmailQuery(email));
        return Ok(result);
    }

    // -------------------------------------------------------------
    // GET USERS OF TENANT
    // -------------------------------------------------------------
    [HttpGet]
    [Authorize(Policy = "UserRead")]
    public async Task<IActionResult> GetTenantUsers()
    {
        var result = await _mediator.Send(new GetUsersByTenantQuery());
        return Ok(result);
    }

    // -------------------------------------------------------------
    // GET USERS OF CAMPUS
    // -------------------------------------------------------------
    [HttpGet("campus/{campusId:guid}")]
    [Authorize(Policy = "UserRead")]
    public async Task<IActionResult> GetCampusUsers(Guid campusId)
    {
        var result = await _mediator.Send(new GetUsersByCampusQuery(campusId));
        return Ok(result);
    }

    // -------------------------------------------------------------
    // CREATE USER
    // -------------------------------------------------------------
    [HttpPost]
    [Authorize(Policy = "UserWrite")]
    //[AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var result = await _mediator.Send(new CreateUserCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // -------------------------------------------------------------
    // UPDATE USER
    // -------------------------------------------------------------
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "UserWrite")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, dto));
        return Ok(result);
    }

    // -------------------------------------------------------------
    // DELETE USER (SOFT DELETE)
    // -------------------------------------------------------------
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "UserWrite")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand(id));
        if (!result)
            return NotFound();

        return NoContent();
    }
}
