using CarRental.API.Models;
using CarRental_API.Models;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Car> Cars { get; set; }
    public DbSet<CarCategory> CarCategories { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Rental> Rentals { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Car>()
            .Property(c => c.DailyRate)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Rental>()
            .Property(r => r.TotalCost)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<MaintenanceRecord>()
            .Property(m => m.Cost)
            .HasColumnType("decimal(10,2)");

        modelBuilder.Entity<Rental>()
            .HasOne(r => r.Payment)
            .WithOne(p => p.Rental)
            .HasForeignKey<Payment>(p => p.RentalId);

        modelBuilder.Entity<CarCategory>().HasData(
            new CarCategory { Id = 1, Name = "Economy", Description = "Бюджетные автомобили" },
            new CarCategory { Id = 2, Name = "Business", Description = "Бизнес-класс" },
            new CarCategory { Id = 3, Name = "Premium", Description = "Премиум-класс" },
            new CarCategory { Id = 4, Name = "SUV", Description = "Внедорожники" }
        );

        modelBuilder.Entity<Employee>().HasData(
            new Employee { Id = 1, FullName = "Иванов Иван Иванович",   Email = "ivanov@carrental.ru",  Phone = "+375-29-111-22-33", Position = "Менеджер",      HireDate = new DateTime(2026, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
            new Employee { Id = 2, FullName = "Петрова Анна Сергеевна", Email = "petrova@carrental.ru", Phone = "+375-44-444-55-66", Position = "Администратор", HireDate = new DateTime(2026, 7, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
