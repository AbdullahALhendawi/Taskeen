using Microsoft.AspNetCore.Mvc;
using Taskeen.Api.DTOs;
using Taskeen.Api.Services;

namespace Taskeen.Api.Controllers;

[ApiController]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet("api/rooms/{id}")]
    public ActionResult<RoomDetailDto> GetRoomDetail(Guid id)
    {
        return Ok(_roomService.GetRoomDetail(id));
    }

    [HttpPost("api/apartments/{apartmentId}/rooms")]
    public IActionResult AddRooms(Guid apartmentId, AddRoomsRequest request)
    {
        _roomService.AddRooms(apartmentId, request.Count, request.BedsPerRoom);
        return NoContent();
    }

    [HttpDelete("api/rooms/{id}")]
    public IActionResult DeleteRoom(Guid id)
    {
        _roomService.DeleteRoom(id);
        return NoContent();
    }

    [HttpPost("api/rooms/{roomId}/beds")]
    public IActionResult AddBed(Guid roomId)
    {
        _roomService.AddBed(roomId);
        return NoContent();
    }

    [HttpDelete("api/beds/{bedId}")]
    public IActionResult RemoveBed(Guid bedId)
    {
        _roomService.RemoveBed(bedId);
        return NoContent();
    }
}