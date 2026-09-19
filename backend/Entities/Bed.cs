namespace Taskeen.Api.Entities;

public class Bed
{
    public Guid Id { get; set; }
    public int BedNumber { get; set; }

    public Guid RoomId { get; set; }
    public Room Room { get; set; } = null!;

    public Guid? ResidentId { get; set; }
    public Resident? Resident { get; set; }
}