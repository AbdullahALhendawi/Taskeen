using Taskeen.Api.DTOs;

namespace Taskeen.Api.Services;

public interface IResidentService
{
    List<ResidentDto> GetAllResidents(string? search);
    ResidentDetailDto GetResidentDetail(Guid id);
    Guid CreateResident(CreateResidentRequest request);
    void UpdateResident(Guid id, CreateResidentRequest request);
    void DeleteResident(Guid id);
    void AssignToBed(Guid bedId, Guid residentId);
    void UnassignBed(Guid bedId);
}