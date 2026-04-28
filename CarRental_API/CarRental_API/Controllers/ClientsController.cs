using CarRental.API.Data;
using CarRental.API.DTOs;
using CarRental.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ClientsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clients = await _db.Clients
            .Select(c => new ClientDto
            {
                Id = c.Id,
                FullName = c.FullName,
                Email = c.Email,
                Phone = c.Phone,
                PassportNumber = c.PassportNumber,
                DriverLicense = c.DriverLicense,
                CreatedAt = c.CreatedAt,
                RentalsCount = c.Rentals.Count
            })
            .ToListAsync();
        return Ok(clients);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (c is null) return NotFound();
        return Ok(new ClientDto
        {
            Id = c.Id,
            FullName = c.FullName,
            Email = c.Email,
            Phone = c.Phone,
            PassportNumber = c.PassportNumber,
            DriverLicense = c.DriverLicense,
            CreatedAt = c.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateClientDto dto)
    {
        var client = new Client
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Phone = dto.Phone,
            PassportNumber = dto.PassportNumber,
            DriverLicense = dto.DriverLicense
        };
        _db.Clients.Add(client);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = client.Id },
            new ClientDto
            {
                Id = client.Id,
                FullName = client.FullName,
                Email = client.Email,
                Phone = client.Phone,
                PassportNumber = client.PassportNumber,
                DriverLicense = client.DriverLicense,
                CreatedAt = client.CreatedAt
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateClientDto dto)
    {
        var c = await _db.Clients.FindAsync(id);
        if (c is null) return NotFound();
        c.FullName = dto.FullName; c.Email = dto.Email; c.Phone = dto.Phone;
        c.PassportNumber = dto.PassportNumber; c.DriverLicense = dto.DriverLicense;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await _db.Clients.FindAsync(id);
        if (c is null) return NotFound();
        _db.Clients.Remove(c);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
