using CarRental.API.Data;
using CarRental.API.DTOs;
using CarRental.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RentalsController : ControllerBase
{
    private readonly AppDbContext _db;
    public RentalsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Rentals
            .Include(r => r.Car)
            .Include(r => r.Client)
            .Include(r => r.Employee)
            .Select(r => new RentalDto
            {
                Id = r.Id,
                CarId = r.CarId,
                CarName = r.Car.Brand + " " + r.Car.Model,
                CarPlate = r.Car.PlateNumber,
                ClientId = r.ClientId,
                ClientName = r.Client.FullName,
                EmployeeId = r.EmployeeId,
                EmployeeName = r.Employee.FullName,
                StartDate = r.StartDate,
                EndDate = r.EndDate,
                ActualReturnDate = r.ActualReturnDate,
                TotalCost = r.TotalCost,
                Status = r.Status
            })
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var r = await _db.Rentals
            .Include(x => x.Car).Include(x => x.Client).Include(x => x.Employee)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (r is null) return NotFound();
        return Ok(new RentalDto
        {
            Id = r.Id,
            CarId = r.CarId,
            CarName = r.Car.Brand + " " + r.Car.Model,
            CarPlate = r.Car.PlateNumber,
            ClientId = r.ClientId,
            ClientName = r.Client.FullName,
            EmployeeId = r.EmployeeId,
            EmployeeName = r.Employee.FullName,
            StartDate = r.StartDate,
            EndDate = r.EndDate,
            ActualReturnDate = r.ActualReturnDate,
            TotalCost = r.TotalCost,
            Status = r.Status
        });
    }

    // POST /api/rentals
    [HttpPost]
    public async Task<IActionResult> Create(CreateRentalDto dto)
    {
        var car = await _db.Cars.FindAsync(dto.CarId);
        if (car is null) return BadRequest("Автомобиль не найден");
        if (car.Status != "available") return BadRequest("Автомобиль недоступен для аренды");

        var days = (dto.EndDate - dto.StartDate).Days;
        if (days <= 0) return BadRequest("Некорректные даты аренды");

        var rental = new Rental
        {
            CarId = dto.CarId,
            ClientId = dto.ClientId,
            EmployeeId = dto.EmployeeId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TotalCost = car.DailyRate * days,
            Status = "active"
        };

        car.Status = "rented";

        _db.Rentals.Add(rental);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = rental.Id }, rental);
    }

    // PATCH /api/rentals/{id}/complete
    [HttpPatch("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var rental = await _db.Rentals.Include(r => r.Car).FirstOrDefaultAsync(r => r.Id == id);
        if (rental is null) return NotFound();
        rental.Status = "completed";
        rental.ActualReturnDate = DateTime.UtcNow;
        rental.Car.Status = "available";
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // PATCH /api/rentals/{id}/cancel 
    [HttpPatch("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var rental = await _db.Rentals.Include(r => r.Car).FirstOrDefaultAsync(r => r.Id == id);
        if (rental is null) return NotFound();
        rental.Status = "cancelled";
        rental.Car.Status = "available";
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
