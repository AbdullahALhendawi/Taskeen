using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Data;
using Taskeen.Api.DTOs;
using Taskeen.Api.Entities;

namespace Taskeen.Api.Services;

public class BuildingService : IBuildingService
{
    private readonly TaskeenDbContext _context;

    public BuildingService(TaskeenDbContext context)
    {
        _context = context;
    }

    public List<BuildingSummaryDto> GetAllBuildings()
    {
        return _context.Buildings
            .Select(b => new BuildingSummaryDto
            {
                Id = b.Id,
                Name = b.Name,
                CreatedAt = b.CreatedAt,
                FloorCount = b.Floors.Count,
                ApartmentCount = b.Floors.SelectMany(f => f.Apartments).Count(),
                RoomCount = b.Floors.SelectMany(f => f.Apartments).SelectMany(a => a.Rooms).Count(),
                TotalBeds = b.Floors.SelectMany(f => f.Apartments).SelectMany(a => a.Rooms).SelectMany(r => r.Beds).Count(),
                OccupiedBeds = b.Floors.SelectMany(f => f.Apartments).SelectMany(a => a.Rooms).SelectMany(r => r.Beds).Count(bed => bed.ResidentId != null)
            })
            .ToList();
    }

    public BuildingDetailDto GetBuildingDetail(Guid id)
    {
        var building = _context.Buildings
            .Include(b => b.Floors)
                .ThenInclude(f => f.Apartments)
                    .ThenInclude(a => a.Rooms)
                        .ThenInclude(r => r.Beds)
                            .ThenInclude(bed => bed.Resident)
            .FirstOrDefault(b => b.Id == id);

        if (building == null)
            throw new KeyNotFoundException("Building not found.");

        return new BuildingDetailDto
        {
            Id = building.Id,
            Name = building.Name,
            Floors = building.Floors
                .OrderBy(f => f.FloorNumber)
                .Select(f => new FloorDetailDto
                {
                    Id = f.Id,
                    FloorNumber = f.FloorNumber,
                    Apartments = f.Apartments
                        .OrderBy(a => a.ApartmentNumber)
                        .Select(a => new ApartmentDetailDto
                        {
                            Id = a.Id,
                            ApartmentNumber = a.ApartmentNumber,
                            Rooms = a.Rooms
                                .OrderBy(r => r.RoomNumber)
                                .Select(r => new RoomDetailDto
                                {
                                    Id = r.Id,
                                    RoomNumber = r.RoomNumber,
                                    Beds = r.Beds
                                        .OrderBy(bed => bed.BedNumber)
                                        .Select(bed => new BedDetailDto
                                        {
                                            Id = bed.Id,
                                            BedNumber = bed.BedNumber,
                                            ResidentId = bed.ResidentId,
                                            ResidentName = bed.Resident != null ? bed.Resident.FullName : null,
                                        }).ToList(),
                                }).ToList(),
                        }).ToList(),
                }).ToList(),
        };
    }

    public Guid CreateBuilding(CreateBuildingRequest request)
    {
        var building = new Building
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        int apartmentCounter = 1;

        for (int f = 1; f <= request.FloorCount; f++)
        {
            var floor = new Floor
            {
                Id = Guid.NewGuid(),
                FloorNumber = f,
                BuildingId = building.Id
            };

            for (int a = 1; a <= request.ApartmentsPerFloor; a++)
            {
                var apartment = new Apartment
                {
                    Id = Guid.NewGuid(),
                    ApartmentNumber = apartmentCounter++,
                    FloorId = floor.Id
                };

                for (int r = 1; r <= request.RoomsPerApartment; r++)
                {
                    var room = new Room
                    {
                        Id = Guid.NewGuid(),
                        RoomNumber = r,
                        ApartmentId = apartment.Id
                    };

                    for (int bedNum = 1; bedNum <= request.BedsPerRoom; bedNum++)
                    {
                        room.Beds.Add(new Bed
                        {
                            Id = Guid.NewGuid(),
                            BedNumber = bedNum,
                            RoomId = room.Id
                        });
                    }

                    apartment.Rooms.Add(room);
                }

                floor.Apartments.Add(apartment);
            }

            building.Floors.Add(floor);
        }

        _context.Buildings.Add(building);
        _context.SaveChanges();

        return building.Id;
    }

    public void DeleteBuilding(Guid id)
    {
        var building = _context.Buildings
            .Include(b => b.Floors)
                .ThenInclude(f => f.Apartments)
                    .ThenInclude(a => a.Rooms)
                        .ThenInclude(r => r.Beds)
            .FirstOrDefault(b => b.Id == id);

        if (building == null)
            throw new KeyNotFoundException("Building not found.");

        var allBeds = building.Floors.SelectMany(f => f.Apartments).SelectMany(a => a.Rooms).SelectMany(r => r.Beds).ToList();
        var allRooms = building.Floors.SelectMany(f => f.Apartments).SelectMany(a => a.Rooms).ToList();
        var allApartments = building.Floors.SelectMany(f => f.Apartments).ToList();
        var allFloors = building.Floors.ToList();

        bool hasOccupiedBed = allBeds.Any(bed => bed.ResidentId != null);

        if (hasOccupiedBed)
            throw new InvalidOperationException("Cannot delete a building with an occupied bed inside it.");

        // Remove children in the correct order (deepest first) so EF Core
        // never sees a "required relationship severed" state along the way.
        _context.Beds.RemoveRange(allBeds);
        _context.Rooms.RemoveRange(allRooms);
        _context.Apartments.RemoveRange(allApartments);
        _context.Floors.RemoveRange(allFloors);
        _context.Buildings.Remove(building);

        _context.SaveChanges();
    }

    public NearestBedDto? FindNearestEmptyBed()
    {
        var result = _context.Buildings
            .Include(b => b.Floors)
                .ThenInclude(f => f.Apartments)
                    .ThenInclude(a => a.Rooms)
                        .ThenInclude(r => r.Beds)
            .SelectMany(b => b.Floors
                .OrderBy(f => f.FloorNumber)
                .SelectMany(f => f.Apartments
                    .OrderBy(a => a.ApartmentNumber)
                    .SelectMany(a => a.Rooms
                        .OrderBy(r => r.RoomNumber)
                        .SelectMany(r => r.Beds
                            .Where(bed => bed.ResidentId == null)
                            .Select(bed => new NearestBedDto
                            {
                                BedId = bed.Id,
                                BuildingId = b.Id,
                                RoomId = r.Id,
                                BuildingName = b.Name,
                                FloorNumber = f.FloorNumber,
                                ApartmentNumber = a.ApartmentNumber,
                                RoomNumber = r.RoomNumber,
                            })))))
            .FirstOrDefault();

        return result;
    }
}