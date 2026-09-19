namespace Taskeen.Api.Entities;

public class Floor
{
    public Guid Id { get; set; }
    public int FloorNumber { get; set; }

    public Guid BuildingId { get; set; }
    public Building Building { get; set; } = null!;

    public List<Apartment> Apartments { get; set; } = new();
}