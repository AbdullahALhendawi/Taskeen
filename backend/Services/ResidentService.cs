using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Data;
using Taskeen.Api.DTOs;
using Taskeen.Api.Entities;

namespace Taskeen.Api.Services;

public class ResidentService : IResidentService
{
    private readonly TaskeenDbContext _context;

    public ResidentService(TaskeenDbContext context)
    {
        _context = context;
    }

    public List<ResidentDto> GetAllResidents(string? search)
    {
        var query = _context.Residents.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(r => r.FullName.Contains(search));
        }

        return query
            .Select(r => new ResidentDto
            {
                Id = r.Id,
                EmployeeId = r.EmployeeId,
                FullName = r.FullName,
                Phone = r.Phone,
                Nationality = r.Nationality,
                JobTitle = r.JobTitle,
                IsAccommodated = r.Bed != null
            })
            .ToList();
    }

    public ResidentDetailDto GetResidentDetail(Guid id)
    {
        var resident = _context.Residents
            .Include(r => r.Bed)
                .ThenInclude(b => b!.Room)
                    .ThenInclude(room => room!.Apartment)
                        .ThenInclude(apt => apt!.Floor)
                            .ThenInclude(floor => floor!.Building)
            .FirstOrDefault(r => r.Id == id);

        if (resident == null)
            throw new KeyNotFoundException("Resident not found.");

        var dto = new ResidentDetailDto
        {
            Id = resident.Id,
            EmployeeId = resident.EmployeeId,
            FullName = resident.FullName,
            Phone = resident.Phone,
            Nationality = resident.Nationality,
            JobTitle = resident.JobTitle,
            IsAccommodated = resident.Bed != null,
        };

        if (resident.Bed != null)
        {
            dto.BedNumber = resident.Bed.BedNumber;
            dto.RoomNumber = resident.Bed.Room.RoomNumber;
            dto.ApartmentNumber = resident.Bed.Room.Apartment.ApartmentNumber;
            dto.FloorNumber = resident.Bed.Room.Apartment.Floor.FloorNumber;
            dto.BuildingName = resident.Bed.Room.Apartment.Floor.Building.Name;
        }

        return dto;
    }

    public Guid CreateResident(CreateResidentRequest request)
    {
        var resident = new Resident
        {
            Id = Guid.NewGuid(),
            EmployeeId = request.EmployeeId,
            FullName = request.FullName,
            Phone = request.Phone,
            Nationality = request.Nationality,
            JobTitle = request.JobTitle
        };

        _context.Residents.Add(resident);
        _context.SaveChanges();

        return resident.Id;
    }

    public void UpdateResident(Guid id, CreateResidentRequest request)
    {
        var resident = _context.Residents.FirstOrDefault(r => r.Id == id);
        if (resident == null)
            throw new KeyNotFoundException("Resident not found.");

        resident.EmployeeId = request.EmployeeId;
        resident.FullName = request.FullName;
        resident.Phone = request.Phone;
        resident.Nationality = request.Nationality;
        resident.JobTitle = request.JobTitle;

        _context.SaveChanges();
    }

    public void DeleteResident(Guid id)
    {
        var resident = _context.Residents
            .Include(r => r.Bed)
            .FirstOrDefault(r => r.Id == id);

        if (resident == null)
            throw new KeyNotFoundException("Resident not found.");

        if (resident.Bed != null)
            throw new InvalidOperationException("Cannot delete a resident who is currently assigned to a bed.");

        _context.Residents.Remove(resident);
        _context.SaveChanges();
    }

    public void AssignToBed(Guid bedId, Guid residentId)
    {
        var bed = _context.Beds.FirstOrDefault(b => b.Id == bedId);
        if (bed == null)
            throw new KeyNotFoundException("Bed not found.");

        var resident = _context.Residents.FirstOrDefault(r => r.Id == residentId);
        if (resident == null)
            throw new KeyNotFoundException("Resident not found.");

        if (bed.ResidentId == residentId)
            return;

        bool alreadyAssignedElsewhere = _context.Beds.Any(b => b.ResidentId == residentId && b.Id != bedId);
        if (alreadyAssignedElsewhere)
            throw new InvalidOperationException("This resident is already assigned to another bed.");

        if (bed.ResidentId != null)
            throw new InvalidOperationException("This bed is already occupied.");

        bed.ResidentId = residentId;
        _context.SaveChanges();
    }

    public void UnassignBed(Guid bedId)
    {
        var bed = _context.Beds.FirstOrDefault(b => b.Id == bedId);
        if (bed == null)
            throw new KeyNotFoundException("Bed not found.");

        bed.ResidentId = null;
        _context.SaveChanges();
    }
}