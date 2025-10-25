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

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
                throw new UnauthorizedAccessException("User ID claim not found.");
            return int.Parse(userIdClaim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses(int limit = 100)
        {
            var userId = GetUserId();
            var expenses = await _context.Expenses
                                .Where(e => e.UserId == userId)
                                .Include(e => e.Category)
                                .OrderByDescending(e => e.Date) // optional: newest first
                                .Take(limit) // restrict number of results
                                .ToListAsync();
            return Ok(expenses);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            var userId = GetUserId();
            expense.UserId = userId;
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = GetUserId();

            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
            if (expense == null) return NotFound();

            if (expense.UserId != userId) return Forbid();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense updatedExpense)
        {
            var userId = GetUserId();
            if (id != updatedExpense.Id)
                return BadRequest("Expense ID mismatch "+"id : "+id+" updatedExpense.Id : "+updatedExpense.Id);
            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
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
            var userId = GetUserId();
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

        // Controllers/ExpensesController.cs
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetExpenseSummary([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = GetUserId();

            var query = _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.UserId == userId);

            if (startDate.HasValue)
                query = query.Where(e => e.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(e => e.Date <= endDate.Value);

            var expenses = await query.ToListAsync();

            var totalSpent = expenses.Sum(e => e.Amount);

            decimal averagePerDay = 0;
            if (expenses.Any())
            {
                var minDate = expenses.Min(e => e.Date);
                var maxDate = expenses.Max(e => e.Date);
                var days = (maxDate - minDate).TotalDays + 1;
                averagePerDay = totalSpent / (decimal)days;
            }

            var topCategory = expenses
                .Where(e => e.Category != null)
                .GroupBy(e => e.Category.Name)
                .Select(g => new
                {
                    CategoryName = g.Key,
                    Total = g.Sum(e => e.Amount)
                })
                .OrderByDescending(x => x.Total)
                .FirstOrDefault()?.CategoryName ?? "No expenses";

            return Ok(new
            {
                TotalSpent = totalSpent,
                AveragePerDay = averagePerDay,
                TopCategory = topCategory
            });
        }

        [HttpGet("chart-data")]
        public async Task<ActionResult<object>> GetChartData()
        {
            var userId = GetUserId();
            var expenses = await _context.Expenses
                .Include(e => e.Category)
                .Where(e => e.UserId == userId)
                .ToListAsync();

            var byCategory = expenses
                .GroupBy(e => e.Category?.Name ?? "Uncategorized")
                .Select(g => new
                {
                    Category = g.Key,
                    Amount = g.Sum(e => e.Amount)
                })
                .OrderByDescending(x => x.Amount)
                .ToList();

            var sixMonthsAgo = DateTime.Now.AddMonths(-6);
            var byMonth = expenses
                .Where(e => e.Date >= sixMonthsAgo)
                .GroupBy(e => new DateTime(e.Date.Year, e.Date.Month, 1))
                .Select(g => new
                {
                    Month = g.Key.ToString("yyyy-MM"),
                    Amount = g.Sum(e => e.Amount)
                })
                .OrderBy(x => x.Month)
                .ToList();

            return Ok(new { ByCategory = byCategory, ByMonth = byMonth });
        }

    }
}
