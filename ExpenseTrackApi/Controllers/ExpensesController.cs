using Microsoft.AspNetCore.Mvc;
using ExpenseTrackApi.Models;
using ExpenseTrackApi.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly ExpenseContext _context;

        public ExpensesController(ExpenseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses()
        {
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .ToListAsync();
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense updatedExpense)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null) return NotFound();

            expense.Title = updatedExpense.Title;
            expense.Amount = updatedExpense.Amount;
            expense.Date = updatedExpense.Date;

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
            var query = _context.Expenses.AsQueryable();

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

            var expenses = await query.ToListAsync();
            return Ok(expenses);
        }

    }
}
