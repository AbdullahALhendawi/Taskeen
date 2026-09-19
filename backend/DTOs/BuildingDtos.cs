namespace Taskeen.Api.DTOs;

public class BuildingSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int FloorCount { get; set; }
    public int ApartmentCount { get; set; }
    public int RoomCount { get; set; }
    public int TotalBeds { get; set; }
    public int OccupiedBeds { get; set; }
}

public class CreateBuildingRequest
{
    public string Name { get; set; } = string.Empty;
    public int FloorCount { get; set; }
    public int ApartmentsPerFloor { get; set; }
    public int RoomsPerApartment { get; set; }
    public int BedsPerRoom { get; set; }
}

public class BuildingDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<FloorDetailDto> Floors { get; set; } = new();
}

public class FloorDetailDto
{
    public Guid Id { get; set; }
    public int FloorNumber { get; set; }
    public List<ApartmentDetailDto> Apartments { get; set; } = new();
}

public class ApartmentDetailDto
{
    public Guid Id { get; set; }
    public int ApartmentNumber { get; set; }
    public List<RoomDetailDto> Rooms { get; set; } = new();
}

public class RoomDetailDto
{
    public Guid Id { get; set; }
    public int RoomNumber { get; set; }
    public List<BedDetailDto> Beds { get; set; } = new();
}

public class BedDetailDto
{
    public Guid Id { get; set; }
    public int BedNumber { get; set; }
    public Guid? ResidentId { get; set; }
    public string? ResidentName { get; set; }
}
public class NearestBedDto
{
    public Guid BedId { get; set; }
    public Guid BuildingId { get; set; }
    public Guid RoomId { get; set; }
    public string BuildingName { get; set; } = string.Empty;
    public int FloorNumber { get; set; }
    public int ApartmentNumber { get; set; }
    public int RoomNumber { get; set; }
}