using BCrypt.Net;
using Business_Layer;
using Business_Layer.Enums;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BusinessLayer
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
        [JsonIgnore]
        public List<Post> Posts { get; set; } = new List<Post>();
        [JsonIgnore]
        public List<Comment> Comments { get; set; } = new List<Comment>();
        [Required]
        public DateTime CreatedAt { get; set; }
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
