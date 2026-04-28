using System.Runtime.ConstrainedExecution;

namespace CarRental.API.Models;

public class CarCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Car> Cars { get; set; } = new List<Car>();
}
