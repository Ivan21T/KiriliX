using DataLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business_Layer
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public User Author { get; set; }
        [Required]
        public List<Comment> Comments { get; set; } = new List<Comment>();
        [Required]
        public int Views { get; set; }

    }
}
