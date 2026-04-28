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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Payments
            .Select(p => new PaymentDto { Id = p.Id, RentalId = p.RentalId, Amount = p.Amount, PaymentDate = p.PaymentDate, PaymentMethod = p.PaymentMethod })
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePaymentDto dto)
    {
        var payment = new Payment { RentalId = dto.RentalId, Amount = dto.Amount, PaymentMethod = dto.PaymentMethod };
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return Ok(new PaymentDto { Id = payment.Id, RentalId = payment.RentalId, Amount = payment.Amount, PaymentDate = payment.PaymentDate, PaymentMethod = payment.PaymentMethod });
    }
}
