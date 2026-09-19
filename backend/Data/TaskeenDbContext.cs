using Microsoft.EntityFrameworkCore;
using Taskeen.Api.Entities;

namespace Taskeen.Api.Data;

public class TaskeenDbContext : DbContext
{
    public TaskeenDbContext(DbContextOptions<TaskeenDbContext> options) : base(options)
    {
    }

    public DbSet<Building> Buildings { get; set; } = null!;
    public DbSet<Floor> Floors { get; set; } = null!;
    public DbSet<Apartment> Apartments { get; set; } = null!;
    public DbSet<Room> Rooms { get; set; } = null!;
    public DbSet<Bed> Beds { get; set; } = null!;
    public DbSet<Resident> Residents { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bed>()
            .HasOne(b => b.Resident)
            .WithOne(r => r.Bed)
            .HasForeignKey<Bed>(b => b.ResidentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Floor>()
            .HasOne(f => f.Building)
            .WithMany(b => b.Floors)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Apartment>()
            .HasOne(a => a.Floor)
            .WithMany(f => f.Apartments)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Room>()
            .HasOne(r => r.Apartment)
            .WithMany(a => a.Rooms)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Bed>()
            .HasOne(b => b.Room)
            .WithMany(r => r.Beds)
            .OnDelete(DeleteBehavior.Cascade);
    }
}