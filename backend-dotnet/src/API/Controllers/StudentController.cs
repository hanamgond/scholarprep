using Application.DTO.Academic;
using Application.Services.Students.Commands;
using Application.Services.Students.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StudentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // --------------------------------------------------------------------
        // GET /api/student/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin, Teacher
        // CampusAdmin restricted in handler
        // --------------------------------------------------------------------
        [HttpGet("{id:guid}")]
        [Authorize(Policy = "StudentRead")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetStudentByIdQuery(id));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // GET /api/student/class/{classId}/section/{sectionId}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin, Teacher
        // Teachers can read; CampusAdmin restricted to own campus
        // --------------------------------------------------------------------
        [HttpGet("class/{classId:guid}/section/{sectionId:guid}")]
        [Authorize(Policy = "StudentRead")]
        public async Task<IActionResult> GetByClassSection(Guid classId, Guid sectionId)
        {
            var result = await _mediator.Send(new GetStudentsByClassSectionQuery(classId, sectionId));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // GET /api/student/campus/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin, Teacher
        // CampusAdmin → only their own campus
        // Teacher → can read but cannot access other campuses (handler enforces)
        // --------------------------------------------------------------------
        [HttpGet("campus/{campusId:guid}")]
        [Authorize(Policy = "StudentRead")]
        public async Task<IActionResult> GetByCampus(Guid campusId)
        {
            var result = await _mediator.Send(new GetStudentsByCampusQuery(campusId));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // GET /api/student/me
        // Role: Student only
        // Returns only the logged-in student's profile
        // --------------------------------------------------------------------
        [HttpGet("me")]
        [Authorize(Policy = "StudentSelfRead")]
        public async Task<IActionResult> GetMyProfile()
        {
            var result = await _mediator.Send(new GetMyStudentProfileQuery());
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // POST /api/student
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // Teacher/Student CANNOT create students
        // CampusAdmin restricted to own campus
        // --------------------------------------------------------------------
        [HttpPost]
        [Authorize(Policy = "StudentWrite")]
        public async Task<IActionResult> Create([FromBody] CreateStudentDto dto)
        {
            var result = await _mediator.Send(new CreateStudentCommand(dto));
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // --------------------------------------------------------------------
        // PUT /api/student/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // Teachers cannot update
        // CampusAdmin restricted to own campus (handler enforces)
        // Students cannot update themselves
        // --------------------------------------------------------------------
        [HttpPut("{id:guid}")]
        [Authorize(Policy = "StudentWrite")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStudentDto dto)
        {
            var result = await _mediator.Send(new UpdateStudentCommand(id, dto));
            return Ok(result);
        }

        // --------------------------------------------------------------------
        // DELETE /api/student/{id}
        // Roles: SuperAdmin, TenantAdmin, CampusAdmin
        // Soft delete only
        // --------------------------------------------------------------------
        [HttpDelete("{id:guid}")]
        [Authorize(Policy = "StudentWrite")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _mediator.Send(new DeleteStudentCommand(id));
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
