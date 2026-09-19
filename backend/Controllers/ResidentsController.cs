using Microsoft.AspNetCore.Mvc;
using Taskeen.Api.DTOs;
using Taskeen.Api.Services;

namespace Taskeen.Api.Controllers;

[ApiController]
[Route("api/residents")]
public class ResidentsController : ControllerBase
{
    private readonly IResidentService _residentService;

    public ResidentsController(IResidentService residentService)
    {
        _residentService = residentService;
    }

    [HttpGet]
    public ActionResult<List<ResidentDto>> GetAllResidents([FromQuery] string? search)
    {
        return Ok(_residentService.GetAllResidents(search));
    }

    [HttpGet("{id}")]
    public ActionResult<ResidentDetailDto> GetResidentDetail(Guid id)
    {
        return Ok(_residentService.GetResidentDetail(id));
    }

    [HttpPost]
    public ActionResult<Guid> CreateResident(CreateResidentRequest request)
    {
        var newId = _residentService.CreateResident(request);
        return CreatedAtAction(nameof(GetAllResidents), new { id = newId }, newId);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateResident(Guid id, CreateResidentRequest request)
    {
        _residentService.UpdateResident(id, request);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteResident(Guid id)
    {
        _residentService.DeleteResident(id);
        return NoContent();
    }
}