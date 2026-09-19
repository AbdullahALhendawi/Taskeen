using Microsoft.AspNetCore.Mvc;
using Taskeen.Api.DTOs;
using Taskeen.Api.Services;

namespace Taskeen.Api.Controllers;

[ApiController]
public class BedsController : ControllerBase
{
    private readonly IResidentService _residentService;
    private readonly IBuildingService _buildingService;

    public BedsController(IResidentService residentService, IBuildingService buildingService)
    {
        _residentService = residentService;
        _buildingService = buildingService;
    }

    [HttpPost("api/beds/{bedId}/assign")]
    public IActionResult AssignBed(Guid bedId, AssignBedRequest request)
    {
        _residentService.AssignToBed(bedId, request.ResidentId);
        return NoContent();
    }

    [HttpPost("api/beds/{bedId}/unassign")]
    public IActionResult UnassignBed(Guid bedId)
    {
        _residentService.UnassignBed(bedId);
        return NoContent();
    }

    [HttpGet("api/beds/nearest-empty")]
    public ActionResult<NearestBedDto> GetNearestEmptyBed()
    {
        var result = _buildingService.FindNearestEmptyBed();
        if (result == null)
        {
            return NotFound(new { error = "No empty beds available." });
        }
        return Ok(result);
    }
}