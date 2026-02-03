using System.ComponentModel.DataAnnotations;
using BCrypt.Net;
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
        public User()
        {
        }
        public User(string username, string name, string email, string password)
        {
            Username = username;
            Email = email;
            Password = password;
        }
    }
}
