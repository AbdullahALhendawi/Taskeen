using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Data;
using Taskeen.Api.DTOs;
using Taskeen.Api.Entities;

namespace Taskeen.Api.Services;

public class RoomService : IRoomService
{
    private readonly TaskeenDbContext _context;

    public RoomService(TaskeenDbContext context)
    {
        _context = context;
    }

    public RoomDetailDto GetRoomDetail(Guid id)
    {
        var room = _context.Rooms
            .Include(r => r.Beds)
                .ThenInclude(b => b.Resident)
            .FirstOrDefault(r => r.Id == id);

        if (room == null)
            throw new KeyNotFoundException("Room not found.");

        return new RoomDetailDto
        {
            Id = room.Id,
            RoomNumber = room.RoomNumber,
            Beds = room.Beds
                .OrderBy(b => b.BedNumber)
                .Select(b => new BedDetailDto
                {
                    Id = b.Id,
                    BedNumber = b.BedNumber,
                    ResidentId = b.ResidentId,
                    ResidentName = b.Resident != null ? b.Resident.FullName : null,
                }).ToList(),
        };
    }

    public void AddRooms(Guid apartmentId, int count, int bedsPerRoom)
    {
        var apartment = _context.Apartments.FirstOrDefault(a => a.Id == apartmentId);
        if (apartment == null)
            throw new KeyNotFoundException("Apartment not found.");

        var existing = _context.Rooms.Where(r => r.ApartmentId == apartmentId).ToList();
        int start = existing.Count > 0 ? existing.Max(r => r.RoomNumber) + 1 : 1;

        for (int i = 0; i < count; i++)
        {
            var room = new Room
            {
                Id = Guid.NewGuid(),
                ApartmentId = apartmentId,
                RoomNumber = start + i
            };

            for (int bedNum = 1; bedNum <= bedsPerRoom; bedNum++)
            {
                room.Beds.Add(new Bed
                {
                    Id = Guid.NewGuid(),
                    BedNumber = bedNum
                });
            }

            _context.Rooms.Add(room);
        }

        _context.SaveChanges();
    }

    public void DeleteRoom(Guid id)
    {
        var room = _context.Rooms
            .Include(r => r.Beds)
            .FirstOrDefault(r => r.Id == id);

        if (room == null)
            throw new KeyNotFoundException("Room not found.");

        bool hasOccupiedBed = room.Beds.Any(bed => bed.ResidentId != null);
        if (hasOccupiedBed)
            throw new InvalidOperationException("Cannot delete a room with an occupied bed.");

        // Renumber remaining rooms in the same apartment (close the gap)
        var laterRooms = _context.Rooms
            .Where(r => r.ApartmentId == room.ApartmentId && r.RoomNumber > room.RoomNumber)
            .ToList();

        foreach (var r in laterRooms)
        {
            r.RoomNumber -= 1;
        }

        _context.Beds.RemoveRange(room.Beds);
        _context.Rooms.Remove(room);

        _context.SaveChanges();
    }

    public void AddBed(Guid roomId)
    {
        var room = _context.Rooms
            .Include(r => r.Beds)
            .FirstOrDefault(r => r.Id == roomId);

        if (room == null)
            throw new KeyNotFoundException("Room not found.");

        int nextBedNumber = room.Beds.Count > 0 ? room.Beds.Max(b => b.BedNumber) + 1 : 1;

        _context.Beds.Add(new Bed
        {
            Id = Guid.NewGuid(),
            RoomId = roomId,
            BedNumber = nextBedNumber
        });

        _context.SaveChanges();
    }

    public void RemoveBed(Guid bedId)
    {
        var bed = _context.Beds.FirstOrDefault(b => b.Id == bedId);
        if (bed == null)
            throw new KeyNotFoundException("Bed not found.");

        if (bed.ResidentId != null)
            throw new InvalidOperationException("Cannot remove an occupied bed.");

        int roomBedCount = _context.Beds.Count(b => b.RoomId == bed.RoomId);
        if (roomBedCount <= 1)
            throw new InvalidOperationException("A room must have at least 1 bed.");

        _context.Beds.Remove(bed);
        _context.SaveChanges();
    }
}