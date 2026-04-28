using CarRental.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) => _db = db;

    // GET /api/reports/summary 
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalCars = await _db.Cars.CountAsync();
        var availableCars = await _db.Cars.CountAsync(c => c.Status == "available");
        var rentedCars = await _db.Cars.CountAsync(c => c.Status == "rented");
        var totalClients = await _db.Clients.CountAsync();
        var activeRentals = await _db.Rentals.CountAsync(r => r.Status == "active");
        var totalRevenue = await _db.Rentals
            .Where(r => r.Status == "completed")
            .SumAsync(r => (decimal?)r.TotalCost) ?? 0;
        var monthRevenue = await _db.Rentals
            .Where(r => r.Status == "completed" && r.StartDate.Month == DateTime.UtcNow.Month && r.StartDate.Year == DateTime.UtcNow.Year)
            .SumAsync(r => (decimal?)r.TotalCost) ?? 0;

        return Ok(new { totalCars, availableCars, rentedCars, totalClients, activeRentals, totalRevenue, monthRevenue });
    }

    // GET /api/reports/rentals-by-month 
    [HttpGet("rentals-by-month")]
    public async Task<IActionResult> GetRentalsByMonth()
    {
        var data = await _db.Rentals
            .Where(r => r.StartDate >= DateTime.UtcNow.AddMonths(-6))
            .GroupBy(r => new { r.StartDate.Year, r.StartDate.Month })
            .Select(g => new
            {
                year = g.Key.Year,
                month = g.Key.Month,
                count = g.Count()
            })
            .OrderBy(x => x.year).ThenBy(x => x.month)
            .ToListAsync();
        return Ok(data);
    }

    // GET /api/reports/revenue-by-month 
    [HttpGet("revenue-by-month")]
    public async Task<IActionResult> GetRevenueByMonth()
    {
        var data = await _db.Rentals
            .Where(r => r.Status == "completed" && r.StartDate >= DateTime.UtcNow.AddMonths(-6))
            .GroupBy(r => new { r.StartDate.Year, r.StartDate.Month })
            .Select(g => new
            {
                year = g.Key.Year,
                month = g.Key.Month,
                revenue = g.Sum(r => r.TotalCost)
            })
            .OrderBy(x => x.year).ThenBy(x => x.month)
            .ToListAsync();
        return Ok(data);
    }

    // GET /api/reports/cars-by-status 
    [HttpGet("cars-by-status")]
    public async Task<IActionResult> GetCarsByStatus()
    {
        var data = await _db.Cars
            .GroupBy(c => c.Status)
            .Select(g => new { status = g.Key, count = g.Count() })
            .ToListAsync();
        return Ok(data);
    }

    // GET /api/reports/top-cars
    [HttpGet("top-cars")]
    public async Task<IActionResult> GetTopCars()
    {
        var data = await _db.Rentals
            .Include(r => r.Car)
            .GroupBy(r => new { r.CarId, r.Car.Brand, r.Car.Model })
            .Select(g => new { carName = g.Key.Brand + " " + g.Key.Model, count = g.Count() })
            .OrderByDescending(x => x.count)
            .Take(5)
            .ToListAsync();
        return Ok(data);
    }
}
