using Application.DTO.Academic;
using Application.Services.Enrollment.Commands;
using Application.Services.Enrollment.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentController : ControllerBase
{
    private readonly IMediator _mediator;

    public EnrollmentController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // --------------------------------------------------------------------
    // GET /api/enrollment/{id}
    // --------------------------------------------------------------------
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "EnrollmentRead")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetEnrollmentByIdQuery(id));
        return Ok(result);
    }

    // --------------------------------------------------------------------
    // GET /api/enrollment/student/{studentId}
    // --------------------------------------------------------------------
    [HttpGet("student/{studentId:guid}")]
    [Authorize(Policy = "EnrollmentRead")]
    public async Task<IActionResult> GetByStudent(Guid studentId)
    {
        var result = await _mediator.Send(new GetEnrollmentsByStudentQuery(studentId));
        return Ok(result);
    }

    // --------------------------------------------------------------------
    // GET /api/enrollment/class/{classId}
    // --------------------------------------------------------------------
    [HttpGet("class/{classId:guid}")]
    [Authorize(Policy = "EnrollmentRead")]
    public async Task<IActionResult> GetByClass(Guid classId)
    {
        var result = await _mediator.Send(new GetEnrollmentsByClassQuery(classId));
        return Ok(result);
    }

    // --------------------------------------------------------------------
    // GET /api/enrollment/campus/{campusId}
    // --------------------------------------------------------------------
    [HttpGet("campus/{campusId:guid}")]
    [Authorize(Policy = "EnrollmentRead")]
    public async Task<IActionResult> GetByCampus(Guid campusId)
    {
        var result = await _mediator.Send(new GetEnrollmentsByCampusQuery(campusId));
        return Ok(result);
    }

    // --------------------------------------------------------------------
    // GET /api/enrollment (all for tenant)
    // --------------------------------------------------------------------
    [HttpGet]
    [Authorize(Policy = "EnrollmentRead")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllEnrollmentsQuery());
        return Ok(result);
    }

    // --------------------------------------------------------------------
    // POST /api/enrollment
    // --------------------------------------------------------------------
    [HttpPost]
    [Authorize(Policy = "EnrollmentWrite")]
    public async Task<IActionResult> Create([FromBody] CreateEnrollmentDto dto)
    {
        var result = await _mediator.Send(new CreateEnrollmentCommand(dto));
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // --------------------------------------------------------------------
    // PUT /api/enrollment/{id}
    // --------------------------------------------------------------------
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "EnrollmentWrite")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateEnrollmentDto dto)
    {
        var result = await _mediator.Send(new UpdateEnrollmentCommand(id, dto));
        return Ok(result);
    }

    // --------------------------------------------------------------------
    // DELETE /api/enrollment/{id}
    // --------------------------------------------------------------------
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "EnrollmentWrite")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteEnrollmentCommand(id));

        if (!result)
            return NotFound();

        return NoContent();
    }
}
