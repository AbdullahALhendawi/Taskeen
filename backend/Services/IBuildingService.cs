using Taskeen.Api.DTOs;

namespace Taskeen.Api.Services;

public interface IBuildingService
{
    List<BuildingSummaryDto> GetAllBuildings();
    BuildingDetailDto GetBuildingDetail(Guid id);
    Guid CreateBuilding(CreateBuildingRequest request);
    void DeleteBuilding(Guid id);
    NearestBedDto? FindNearestEmptyBed();
}