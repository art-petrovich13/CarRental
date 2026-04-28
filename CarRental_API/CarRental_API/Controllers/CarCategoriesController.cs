using CarRental.API.Data;
using CarRental.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarRental.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CarCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CarCategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _db.CarCategories.ToListAsync();
        return Ok(categories);
    }
}
