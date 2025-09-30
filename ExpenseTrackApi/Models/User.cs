using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackApi.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Username { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        public string Role { get; set; } = "user";

        public required ICollection<Expense> Expenses { get; set; }
    }
}