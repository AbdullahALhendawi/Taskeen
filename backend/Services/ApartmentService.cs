using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Data;
using Taskeen.Api.Entities;

namespace Taskeen.Api.Services;

public class ApartmentService : IApartmentService
{
    private readonly TaskeenDbContext _context;

    public ApartmentService(TaskeenDbContext context)
    {
        _context = context;
    }

    public void AddApartments(Guid floorId, int count)
    {
        var floor = _context.Floors.FirstOrDefault(f => f.Id == floorId);
        if (floor == null)
            throw new KeyNotFoundException("Floor not found.");

        var buildingFloors = _context.Floors
            .Where(f => f.BuildingId == floor.BuildingId)
            .OrderBy(f => f.FloorNumber)
            .ToList();

        var buildingFloorIds = buildingFloors.Select(f => f.Id).ToList();
        var buildingApartments = _context.Apartments
            .Where(a => buildingFloorIds.Contains(a.FloorId))
            .ToList();

        // Find how many apartments exist on floors strictly before this one,
        // plus how many already exist on this floor itself — that tells us
        // exactly where this floor's apartments should end, regardless of
        // what numbers exist on later floors.
        var floorsBeforeThisOne = buildingFloors.Where(f => f.FloorNumber < floor.FloorNumber).ToList();
        var floorIdsBeforeThisOne = floorsBeforeThisOne.Select(f => f.Id).ToList();

        int apartmentsBefore = buildingApartments.Count(a => floorIdsBeforeThisOne.Contains(a.FloorId));
        int apartmentsOnThisFloor = buildingApartments.Count(a => a.FloorId == floorId);

        int insertPosition = apartmentsBefore + apartmentsOnThisFloor + 1;

        // Shift every apartment at or after the insert position, across the
        // whole building, up by `count` to make room for the new ones.
        var apartmentsToShift = buildingApartments
            .Where(a => a.ApartmentNumber >= insertPosition)
            .ToList();

        foreach (var apt in apartmentsToShift)
        {
            apt.ApartmentNumber += count;
        }

        for (int i = 0; i < count; i++)
        {
            _context.Apartments.Add(new Apartment
            {
                Id = Guid.NewGuid(),
                FloorId = floorId,
                ApartmentNumber = insertPosition + i
            });
        }

        _context.SaveChanges();
    }

    public void DeleteApartment(Guid id)
    {
        var apartment = _context.Apartments
            .Include(a => a.Rooms)
                .ThenInclude(r => r.Beds)
            .FirstOrDefault(a => a.Id == id);

        if (apartment == null)
            throw new KeyNotFoundException("Apartment not found.");

        var allBeds = apartment.Rooms.SelectMany(r => r.Beds).ToList();
        var allRooms = apartment.Rooms.ToList();

        bool hasOccupiedBed = allBeds.Any(bed => bed.ResidentId != null);
        if (hasOccupiedBed)
            throw new InvalidOperationException("Cannot delete an apartment with an occupied bed inside it.");

        // Renumber remaining apartments across the building (close the gap)
        var laterApartments = _context.Apartments
            .Where(a => a.ApartmentNumber > apartment.ApartmentNumber)
            .ToList();

        foreach (var a in laterApartments)
        {
            a.ApartmentNumber -= 1;
        }

        _context.Beds.RemoveRange(allBeds);
        _context.Rooms.RemoveRange(allRooms);
        _context.Apartments.Remove(apartment);

        _context.SaveChanges();
    }
}