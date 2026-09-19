using Taskeen.Api.DTOs;

namespace Taskeen.Api.Services;

public interface IRoomService
{
    RoomDetailDto GetRoomDetail(Guid id);
    void AddRooms(Guid apartmentId, int count, int bedsPerRoom);
    void DeleteRoom(Guid id);
    void AddBed(Guid roomId);
    void RemoveBed(Guid bedId);
}