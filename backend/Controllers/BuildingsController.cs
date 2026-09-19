using Microsoft.AspNetCore.Mvc;
using Taskeen.Api.DTOs;
using Taskeen.Api.Services;

namespace Taskeen.Api.Controllers;

[ApiController]
[Route("api/buildings")]
public class BuildingsController : ControllerBase
{
    private readonly IBuildingService _buildingService;

    public BuildingsController(IBuildingService buildingService)
    {
        _buildingService = buildingService;
    }

    [HttpGet]
    public ActionResult<List<BuildingSummaryDto>> GetAllBuildings()
    {
        return Ok(_buildingService.GetAllBuildings());
    }

    [HttpGet("{id}")]
    public ActionResult<BuildingDetailDto> GetBuildingDetail(Guid id)
    {
        return Ok(_buildingService.GetBuildingDetail(id));
    }

    [HttpPost]
    public ActionResult<Guid> CreateBuilding(CreateBuildingRequest request)
    {
        var newId = _buildingService.CreateBuilding(request);
        return CreatedAtAction(nameof(GetAllBuildings), new { id = newId }, newId);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteBuilding(Guid id)
    {
        _buildingService.DeleteBuilding(id);
        return NoContent();
    }
}