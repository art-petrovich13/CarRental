using CarRental.API.Data;
using CarRental.API.DTOs;
using CarRental.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;
    public EmployeesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _db.Employees
            .Select(e => new EmployeeDto { Id = e.Id, FullName = e.FullName, Email = e.Email, Phone = e.Phone, Position = e.Position, HireDate = e.HireDate })
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e is null) return NotFound();
        return Ok(new EmployeeDto { Id = e.Id, FullName = e.FullName, Email = e.Email, Phone = e.Phone, Position = e.Position, HireDate = e.HireDate });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeDto dto)
    {
        var emp = new Employee { FullName = dto.FullName, Email = dto.Email, Phone = dto.Phone, Position = dto.Position, HireDate = dto.HireDate };
        _db.Employees.Add(emp);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = emp.Id }, new EmployeeDto { Id = emp.Id, FullName = emp.FullName, Email = emp.Email, Phone = emp.Phone, Position = emp.Position, HireDate = emp.HireDate });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateEmployeeDto dto)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e is null) return NotFound();
        e.FullName = dto.FullName; e.Email = dto.Email; e.Phone = dto.Phone; e.Position = dto.Position; e.HireDate = dto.HireDate;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var e = await _db.Employees.FindAsync(id);
        if (e is null) return NotFound();
        _db.Employees.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
