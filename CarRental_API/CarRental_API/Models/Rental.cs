namespace CarRental.API.Models;

public class Rental
{
    public int Id { get; set; }
    public int CarId { get; set; }
    public Car Car { get; set; } = null!;
    public int ClientId { get; set; }
    public Client Client { get; set; } = null!;
    public int EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;

    public DateTime StartDate { get; set; }      
    public DateTime EndDate { get; set; }       
    public DateTime? ActualReturnDate { get; set; }     
    public decimal TotalCost { get; set; }     
    public string Status { get; set; } = "active";

    public Payment? Payment { get; set; }
}
