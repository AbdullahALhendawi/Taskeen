namespace Taskeen.Api.Services;

public interface IApartmentService
{
    void AddApartments(Guid floorId, int count);
    void DeleteApartment(Guid id);
}