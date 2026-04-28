namespace CarRental_API.DTOs
{
    public class MaintenanceRecordDto
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public string CarName { get; set; } = string.Empty;
        public string PlateNumber { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string MechanicName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal Cost { get; set; }
        public string Status { get; set; } = string.Empty;
    }
    public class CreateMaintenanceRecordDto
    {
        public int CarId { get; set; }
        public string Description { get; set; } = string.Empty;
        public string MechanicName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public decimal Cost { get; set; }
    }
    public class UpdateMaintenanceRecordDto
    {
        public string Description { get; set; } = string.Empty;
        public string MechanicName { get; set; } = string.Empty;
        public DateTime? EndDate { get; set; }
        public decimal Cost { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}