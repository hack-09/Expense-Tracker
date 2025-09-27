using Microsoft.AspNetCore.Mvc;

namespace ExpenseTrackApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHello()
    {
        return Ok(new { message = "Hello from .NET API 🚀" });
    }
}
