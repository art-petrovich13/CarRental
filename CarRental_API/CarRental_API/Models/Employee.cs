namespace CarRental.API.Models;

public class Employee
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;  
    public DateTime HireDate { get; set; }

    public ICollection<Rental> Rentals { get; set; } = new List<Rental>();
}
