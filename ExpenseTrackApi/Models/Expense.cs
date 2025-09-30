using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExpenseTrackApi.Models
{
    public class Expense
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public decimal Amount { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
