namespace Taskeen.Api.Entities;

public class Resident
{
    public Guid Id { get; set; }
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Nationality { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;

    public Bed? Bed { get; set; }
}