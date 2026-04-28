using CarRental.API.Models;

namespace CarRental_API.Models
{
    public class MaintenanceRecord
    {
        public int Id { get; set; }

        public int CarId { get; set; }
        public Car Car { get; set; } = null!;

        public string Description { get; set; } = string.Empty; 
        public string MechanicName { get; set; } = string.Empty; 

        public DateTime StartDate { get; set; }           
        public DateTime? EndDate { get; set; }          

        public decimal Cost { get; set; }         
        public string Status { get; set; } = "in_progress"; 
    }
}
