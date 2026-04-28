using CarRental.API.Data;
using CarRental.API.DTOs;
using CarRental.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public PaymentsController(AppDbContext db) => _db = db;

    // GET /api/payments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Payments
            .Include(p => p.Rental)
                .ThenInclude(r => r.Client)
            .Include(p => p.Rental)
                .ThenInclude(r => r.Car)
            .Select(p => new PaymentDto
            {
                Id = p.Id,
                RentalId = p.RentalId,
                ClientName = p.Rental.Client.FullName,
                CarName = p.Rental.Car.Brand + " " + p.Rental.Car.Model,
                Amount = p.Amount,
                PaymentDate = p.PaymentDate,
                PaymentMethod = p.PaymentMethod
            })
            .ToListAsync();

        return Ok(list);
    }

    // GET /api/payments/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _db.Payments
            .Include(x => x.Rental).ThenInclude(r => r.Client)
            .Include(x => x.Rental).ThenInclude(r => r.Car)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (p is null) return NotFound();

        return Ok(new PaymentDto
        {
            Id = p.Id,
            RentalId = p.RentalId,
            ClientName = p.Rental.Client.FullName,
            CarName = p.Rental.Car.Brand + " " + p.Rental.Car.Model,
            Amount = p.Amount,
            PaymentDate = p.PaymentDate,
            PaymentMethod = p.PaymentMethod
        });
    }

    // POST /api/payments
    [HttpPost]
    public async Task<IActionResult> Create(CreatePaymentDto dto)
    {
        // Проверяем, что аренда существует
        var rental = await _db.Rentals
            .Include(r => r.Client)
            .Include(r => r.Car)
            .FirstOrDefaultAsync(r => r.Id == dto.RentalId);

        if (rental is null)
            return BadRequest("Аренда не найдена");

        // Проверяем, нет ли уже оплаты за эту аренду (связь 1:1)
        var existing = await _db.Payments.AnyAsync(p => p.RentalId == dto.RentalId);
        if (existing)
            return BadRequest("Оплата за эту аренду уже зарегистрирована");

        var payment = new Payment
        {
            RentalId = dto.RentalId,
            Amount = dto.Amount,
            PaymentMethod = dto.PaymentMethod,
            PaymentDate = DateTime.UtcNow
        };

        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();

        return Ok(new PaymentDto
        {
            Id = payment.Id,
            RentalId = payment.RentalId,
            ClientName = rental.Client.FullName,
            CarName = rental.Car.Brand + " " + rental.Car.Model,
            Amount = payment.Amount,
            PaymentDate = payment.PaymentDate,
            PaymentMethod = payment.PaymentMethod
        });
    }

    // DELETE /api/payments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await _db.Payments.FindAsync(id);
        if (p is null) return NotFound();
        _db.Payments.Remove(p);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}