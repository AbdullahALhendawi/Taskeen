namespace Taskeen.Api.DTOs;

public class ResidentDto
{
    public Guid Id { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public bool IsAccommodated { get; set; }
}

public class ResidentDetailDto
{
    public Guid Id { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public bool IsAccommodated { get; set; }
    public string? BuildingName { get; set; }
    public int? FloorNumber { get; set; }
    public int? ApartmentNumber { get; set; }
    public int? RoomNumber { get; set; }
    public int? BedNumber { get; set; }
}

public class CreateResidentRequest
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
}

public class AssignBedRequest
{
    public Guid ResidentId { get; set; }
}