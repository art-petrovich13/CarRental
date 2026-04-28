namespace CarRental.API.DTOs;

public class ClientDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;
    public string DriverLicense { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int RentalsCount { get; set; } 
}

public class CreateClientDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string PassportNumber { get; set; } = string.Empty;
    public string DriverLicense { get; set; } = string.Empty;
}
