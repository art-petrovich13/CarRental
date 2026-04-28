namespace CarRental.API.DTOs;

public class PaymentDto
{
    public int Id { get; set; }
    public int RentalId { get; set; }
    public string ClientName { get; set; } = string.Empty; 
    public string CarName { get; set; } = string.Empty;  
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string PaymentMethod { get; set; } = string.Empty; 
}

public class CreatePaymentDto
{
    public int RentalId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "cash";
}