using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Data;
using Taskeen.Api.Entities;

namespace Taskeen.Api.Services;

public class FloorService : IFloorService
{
    private readonly TaskeenDbContext _context;

    public FloorService(TaskeenDbContext context)
    {
        _context = context;
    }

    public void AddFloors(Guid buildingId, int count)
    {
        var existing = _context.Floors.Where(f => f.BuildingId == buildingId).ToList();
        int start = existing.Count > 0 ? existing.Max(f => f.FloorNumber) + 1 : 1;

        for (int i = 0; i < count; i++)
        {
            _context.Floors.Add(new Floor
            {
                Id = Guid.NewGuid(),
                BuildingId = buildingId,
                FloorNumber = start + i
            });
        }

        _context.SaveChanges();
    }

    public void DeleteFloor(Guid id)
    {
        var floor = _context.Floors
            .Include(f => f.Apartments)
                .ThenInclude(a => a.Rooms)
                    .ThenInclude(r => r.Beds)
            .FirstOrDefault(f => f.Id == id);

        if (floor == null)
            throw new KeyNotFoundException("Floor not found.");

        var allBeds = floor.Apartments.SelectMany(a => a.Rooms).SelectMany(r => r.Beds).ToList();
        var allRooms = floor.Apartments.SelectMany(a => a.Rooms).ToList();
        var allApartments = floor.Apartments.ToList();

        bool hasOccupiedBed = allBeds.Any(bed => bed.ResidentId != null);

        if (hasOccupiedBed)
            throw new InvalidOperationException("Cannot delete a floor with an occupied bed inside it.");

        // Renumber remaining floors in the same building (close the gap)
        var laterFloors = _context.Floors
            .Where(f => f.BuildingId == floor.BuildingId && f.FloorNumber > floor.FloorNumber)
            .ToList();

        foreach (var f in laterFloors)
        {
            f.FloorNumber -= 1;
        }

        // Renumber apartments across the building (close the gap left by this floor's apartments)
        if (allApartments.Count > 0)
        {
            int removedCount = allApartments.Count;
            int lowestRemoved = allApartments.Min(a => a.ApartmentNumber);

            var buildingFloorIds = _context.Floors
                .Where(f => f.BuildingId == floor.BuildingId)
                .Select(f => f.Id)
                .ToList();

            var laterApartments = _context.Apartments
                .Where(a => buildingFloorIds.Contains(a.FloorId) && a.ApartmentNumber > lowestRemoved)
                .ToList();

            foreach (var apt in laterApartments)
            {
                apt.ApartmentNumber -= removedCount;
            }
        }

        _context.Beds.RemoveRange(allBeds);
        _context.Rooms.RemoveRange(allRooms);
        _context.Apartments.RemoveRange(allApartments);
        _context.Floors.Remove(floor);

        _context.SaveChanges();
    }
}