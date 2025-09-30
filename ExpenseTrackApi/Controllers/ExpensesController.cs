using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ExpenseTrackApi.Models;
using ExpenseTrackApi.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseContext _context;

        public ExpensesController(ExpenseContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetExpenses(int limit = 100)
        {
            var userId = int.Parse(User.FindFirst("id").Value);
            var expenses = await _context.Expenses
                                .Include(e => e.Category)
                                .Where(e => e.UserId == userId)
                                .OrderByDescending(e => e.Date) // optional: newest first
                                .Take(limit) // restrict number of results
                                .ToListAsync();
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            expense.UserId = userId;
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = int.Parse(User.FindFirst("id").Value);

            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound();

            if (expense.UserId != userId) return Forbid();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense updatedExpense)
        {
            var userId = int.Parse(User.FindFirst("id").Value);
            if (id != updatedExpense.Id || updatedExpense.UserId != userId)
                return BadRequest("Expense ID mismatch or unauthorized");
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound();

            if (expense.UserId != userId) return Forbid();

            expense.Title = updatedExpense.Title;
            expense.Amount = updatedExpense.Amount;
            expense.Date = updatedExpense.Date;
            expense.CategoryId = updatedExpense.CategoryId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterExpenses(
            int? categoryId,
            DateTime? fromDate,
            DateTime? toDate,
            decimal? minAmount,
            decimal? maxAmount)
        {
            var userId = int.Parse(User.FindFirst("id").Value);
            // Basic validation
            if (minAmount < 0 || maxAmount < 0) return BadRequest("Amounts must be non-negative");
            if (minAmount.HasValue && maxAmount.HasValue && minAmount > maxAmount)
                return BadRequest("minAmount cannot be greater than maxAmount");
            if (fromDate.HasValue && toDate.HasValue && fromDate > toDate)
                return BadRequest("fromDate cannot be after toDate");

            var query = _context.Expenses.AsQueryable();
            query = _context.Expenses.Where(e => e.UserId == userId);

            if (categoryId.HasValue)
                query = query.Where(e => e.CategoryId == categoryId);

            if (fromDate.HasValue)
                query = query.Where(e => e.Date >= fromDate);

            if (toDate.HasValue)
                query = query.Where(e => e.Date <= toDate);

            if (minAmount.HasValue)
                query = query.Where(e => e.Amount >= minAmount);

            if (maxAmount.HasValue)
                query = query.Where(e => e.Amount <= maxAmount);

            var expenses = await query
                .Include(e => e.Category)
                .OrderByDescending(e => e.Date)
                .Take(100)
                .ToListAsync();

            return Ok(expenses);
        }

    }
}
