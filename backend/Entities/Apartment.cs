namespace Taskeen.Api.Entities;

public class Apartment
{
    public Guid Id { get; set; }
    public int ApartmentNumber { get; set; }

    public Guid FloorId { get; set; }
    public Floor Floor { get; set; } = null!;

    public List<Room> Rooms { get; set; } = new();
}