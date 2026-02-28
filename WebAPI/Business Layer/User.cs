using System.ComponentModel.DataAnnotations;
using BCrypt.Net;
using Business_Layer.Enums;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
namespace DataLayer
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(30)]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public Role Role { get;set; }
        public User()
        {
        }
        public User(string username, string name, string email, string password,Role role)
        {
            Username = username;
            Email = email;
            Password = password;
            Role = role;
        }
    }
}
