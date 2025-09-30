using Microsoft.EntityFrameworkCore;
using ExpenseTrackApi.Models;
namespace ExpenseTrackApi.Data
{
    public class ExpenseContext : DbContext
    {
        public ExpenseContext(DbContextOptions<ExpenseContext> options) : base(options)
        {
        }

        public DbSet<Expense> Expenses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }

        // Seed default categories
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Food"},
                new Category { Id = 2, Name = "Travel"},
                new Category { Id = 3, Name = "Shopping"},
                new Category { Id = 4, Name = "Bills"},
                new Category { Id = 5, Name = "Health"},
                new Category { Id = 6, Name = "Entertainment"},
                new Category { Id = 7, Name = "Education"},
                new Category { Id = 8, Name = "Others"}
            );
        }
    }
}