using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ExpenseTrackApi.Data;
using ExpenseTrackApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ExpenseTrackApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ExpenseContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ExpenseContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.PasswordHash))
                return BadRequest("Username and Password are required.");

            var userExists = await _context.Users.AnyAsync(u => u.Username == user.Username || u.Email == user.Email);
            if (userExists)
                return BadRequest("Username or Email already exists.");

            // Hash the plain password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User login)
        {
            if (string.IsNullOrWhiteSpace(login.Username) || string.IsNullOrWhiteSpace(login.PasswordHash))
                return BadRequest("Username and Password are required.");

            var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == login.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.PasswordHash, user.PasswordHash))
                return Unauthorized("Invalid username or password.");

            // Generate JWT Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["SECRET_KEY"];
            if (string.IsNullOrEmpty(secretKey))
                return StatusCode(500, "JWT secret key is not configured.");
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role ?? "user"),
                    new Claim(ClaimTypes.Name, user.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }
    }
}
