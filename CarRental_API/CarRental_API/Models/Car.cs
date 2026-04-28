using CarRental_API.Models;
using System.Collections;

namespace CarRental.API.Models;

public class Car
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;  
    public string Model { get; set; } = string.Empty;  
    public int Year { get; set; }                  
    public string PlateNumber { get; set; } = string.Empty;  
    public string Color { get; set; } = string.Empty;
    public decimal DailyRate { get; set; }               
    public string Status { get; set; } = "available";   

    public int CategoryId { get; set; }
    public CarCategory Category { get; set; } = null!;

    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
    public ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
}
