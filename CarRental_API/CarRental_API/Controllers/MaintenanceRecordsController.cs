using CarRental.API.Data;
using CarRental.API.DTOs;
using CarRental.API.Models;
using CarRental_API.DTOs;
using CarRental_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaintenanceRecordsController : ControllerBase
{
    private readonly AppDbContext _db;
    public MaintenanceRecordsController(AppDbContext db) => _db = db;

    // GET /api/maintenancerecords
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.MaintenanceRecords
            .Include(m => m.Car)
            .Select(m => new MaintenanceRecordDto
            {
                Id = m.Id,
                CarId = m.CarId,
                CarName = m.Car.Brand + " " + m.Car.Model,
                PlateNumber = m.Car.PlateNumber,
                Description = m.Description,
                MechanicName = m.MechanicName,
                StartDate = m.StartDate,
                EndDate = m.EndDate,
                Cost = m.Cost,
                Status = m.Status
            })
            .ToListAsync();

        return Ok(list);
    }

    // GET /api/maintenancerecords/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var m = await _db.MaintenanceRecords
            .Include(x => x.Car)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (m is null) return NotFound();

        return Ok(new MaintenanceRecordDto
        {
            Id = m.Id,
            CarId = m.CarId,
            CarName = m.Car.Brand + " " + m.Car.Model,
            PlateNumber = m.Car.PlateNumber,
            Description = m.Description,
            MechanicName = m.MechanicName,
            StartDate = m.StartDate,
            EndDate = m.EndDate,
            Cost = m.Cost,
            Status = m.Status
        });
    }

    // POST /api/maintenancerecords — создать запись и перевести авто в статус maintenance
    [HttpPost]
    public async Task<IActionResult> Create(CreateMaintenanceRecordDto dto)
    {
        var car = await _db.Cars.FindAsync(dto.CarId);
        if (car is null) return BadRequest("Автомобиль не найден");

        car.Status = "maintenance";

        var record = new MaintenanceRecord
        {
            CarId = dto.CarId,
            Description = dto.Description,
            MechanicName = dto.MechanicName,
            StartDate = dto.StartDate,
            Cost = dto.Cost,
            Status = "in_progress"
        };

        _db.MaintenanceRecords.Add(record);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = record.Id }, new MaintenanceRecordDto
        {
            Id = record.Id,
            CarId = record.CarId,
            CarName = car.Brand + " " + car.Model,
            PlateNumber = car.PlateNumber,
            Description = record.Description,
            MechanicName = record.MechanicName,
            StartDate = record.StartDate,
            EndDate = record.EndDate,
            Cost = record.Cost,
            Status = record.Status
        });
    }

    // PUT /api/maintenancerecords/{id} — обновить запись
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateMaintenanceRecordDto dto)
    {
        var record = await _db.MaintenanceRecords
            .Include(m => m.Car)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (record is null) return NotFound();

        record.Description = dto.Description;
        record.MechanicName = dto.MechanicName;
        record.EndDate = dto.EndDate;
        record.Cost = dto.Cost;
        record.Status = dto.Status;

        if (dto.Status == "completed")
        {
            record.Car.Status = "available";
            record.EndDate ??= DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // PATCH /api/maintenancerecords/{id}/complete — завершить ремонт
    [HttpPatch("{id}/complete")]
    public async Task<IActionResult> Complete(int id)
    {
        var record = await _db.MaintenanceRecords
            .Include(m => m.Car)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (record is null) return NotFound();

        record.Status = "completed";
        record.EndDate = DateTime.UtcNow;
        record.Car.Status = "available";

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/maintenancerecords/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var record = await _db.MaintenanceRecords.FindAsync(id);
        if (record is null) return NotFound();
        _db.MaintenanceRecords.Remove(record);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}