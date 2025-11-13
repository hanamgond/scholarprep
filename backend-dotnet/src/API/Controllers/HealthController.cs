using Microsoft.AspNetCore.Mvc;

namespace ScholarPrep.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    // This method will handle: GET /api/health
    [HttpGet]
    public IActionResult CheckHealth()
    {
        // It just returns a 200 OK with a simple message
        return Ok(new { Status = "Healthy" });
    }
}