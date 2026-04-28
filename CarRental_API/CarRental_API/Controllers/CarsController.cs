using CarRental.API.Data;
using CarRental.API.DTOs;
using CarRental.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly AppDbContext _db;
    public CarsController(AppDbContext db) => _db = db;

    // GET /api/cars
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var cars = await _db.Cars
            .Include(c => c.Category)
            .Select(c => new CarDto
            {
                Id = c.Id,
                Brand = c.Brand,
                Model = c.Model,
                Year = c.Year,
                PlateNumber = c.PlateNumber,
                Color = c.Color,
                DailyRate = c.DailyRate,
                Status = c.Status,
                CategoryId = c.CategoryId,
                CategoryName = c.Category.Name
            })
            .ToListAsync();
        return Ok(cars);
    }

    // GET /api/cars/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await _db.Cars.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        return Ok(new CarDto
        {
            Id = c.Id,
            Brand = c.Brand,
            Model = c.Model,
            Year = c.Year,
            PlateNumber = c.PlateNumber,
            Color = c.Color,
            DailyRate = c.DailyRate,
            Status = c.Status,
            CategoryId = c.CategoryId,
            CategoryName = c.Category.Name
        });
    }

    // POST /api/cars
    [HttpPost]
    public async Task<IActionResult> Create(CreateCarDto dto)
    {
        var car = new Car
        {
            Brand = dto.Brand,
            Model = dto.Model,
            Year = dto.Year,
            PlateNumber = dto.PlateNumber,
            Color = dto.Color,
            DailyRate = dto.DailyRate,
            Status = dto.Status,
            CategoryId = dto.CategoryId
        };
        _db.Cars.Add(car);
        await _db.SaveChangesAsync();
        var cat = await _db.CarCategories.FindAsync(car.CategoryId);
        return CreatedAtAction(nameof(GetById), new { id = car.Id },
            new CarDto
            {
                Id = car.Id,
                Brand = car.Brand,
                Model = car.Model,
                Year = car.Year,
                PlateNumber = car.PlateNumber,
                Color = car.Color,
                DailyRate = car.DailyRate,
                Status = car.Status,
                CategoryId = car.CategoryId,
                CategoryName = cat?.Name ?? ""
            });
    }

    // PUT /api/cars/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateCarDto dto)
    {
        var car = await _db.Cars.FindAsync(id);
        if (car is null) return NotFound();
        car.Brand = dto.Brand; car.Model = dto.Model; car.Year = dto.Year;
        car.PlateNumber = dto.PlateNumber; car.Color = dto.Color;
        car.DailyRate = dto.DailyRate; car.Status = dto.Status; car.CategoryId = dto.CategoryId;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/cars/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var car = await _db.Cars.FindAsync(id);
        if (car is null) return NotFound();
        _db.Cars.Remove(car);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
