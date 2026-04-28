namespace CarRental.API.DTOs;

public class RentalDto
{
    public int Id { get; set; }
    public int CarId { get; set; }
    public string CarName { get; set; } = string.Empty; 
    public string CarPlate { get; set; } = string.Empty;
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ActualReturnDate { get; set; }
    public decimal TotalCost { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateRentalDto
{
    public int CarId { get; set; }
    public int ClientId { get; set; }
    public int EmployeeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
