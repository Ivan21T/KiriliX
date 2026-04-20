using BCrypt.Net;
using BusinessLayer;
using BusinessLayer.Enums;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
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
        public string Password { get; set; }
        [Required]
        public Role Role { get;set; }
        [JsonIgnore]
        public List<Post> Posts { get; set; } = new List<Post>();
        [JsonIgnore]
        public List<Comment> Comments { get; set; } = new List<Comment>();
        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
