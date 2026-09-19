using Microsoft.AspNetCore.Mvc;
using Taskeen.Api.DTOs;
using Taskeen.Api.Services;

namespace Taskeen.Api.Controllers;

[ApiController]
public class ApartmentsController : ControllerBase
{
    private readonly IApartmentService _apartmentService;

    public ApartmentsController(IApartmentService apartmentService)
    {
        _apartmentService = apartmentService;
    }

    [HttpPost("api/floors/{floorId}/apartments")]
    public IActionResult AddApartments(Guid floorId, AddApartmentsRequest request)
    {
        _apartmentService.AddApartments(floorId, request.Count);
        return NoContent();
    }

    [HttpDelete("api/apartments/{id}")]
    public IActionResult DeleteApartment(Guid id)
    {
        _apartmentService.DeleteApartment(id);
        return NoContent();
    }
}  