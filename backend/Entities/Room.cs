namespace Taskeen.Api.Entities;

public class Room
{
    public Guid Id { get; set; }
    public int RoomNumber { get; set; }

    public Guid ApartmentId { get; set; }
    public Apartment Apartment { get; set; } = null!;

    public List<Bed> Beds { get; set; } = new();
}