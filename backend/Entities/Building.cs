namespace Taskeen.Api.Entities;

public class Building
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public List<Floor> Floors { get; set; } = new();
}