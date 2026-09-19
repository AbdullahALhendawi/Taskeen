using Microsoft.AspNetCore.Mvc;
using Taskeen.Api.DTOs;
using Taskeen.Api.Services;

namespace Taskeen.Api.Controllers;

[ApiController]
public class FloorsController : ControllerBase
{
    private readonly IFloorService _floorService;

    public FloorsController(IFloorService floorService)
    {
        _floorService = floorService;
    }

    [HttpPost("api/buildings/{buildingId}/floors")]
    public IActionResult AddFloors(Guid buildingId, AddFloorsRequest request)
    {
        _floorService.AddFloors(buildingId, request.Count);
        return NoContent();
    }

    [HttpDelete("api/floors/{id}")]
    public IActionResult DeleteFloor(Guid id)
    {
        _floorService.DeleteFloor(id);
        return NoContent();
    }
}