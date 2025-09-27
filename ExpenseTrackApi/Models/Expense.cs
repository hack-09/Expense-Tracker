using System;
using System.ComponentModel.DataAnnotations;

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
    }
}
