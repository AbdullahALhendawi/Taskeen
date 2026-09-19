namespace Taskeen.Api.Services;

public interface IFloorService
{
    void AddFloors(Guid buildingId, int count);
    void DeleteFloor(Guid id);
}