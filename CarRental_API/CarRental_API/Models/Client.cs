namespace CarRental.API.Models;

public class Client
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;
    public string DriverLicense { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
}
