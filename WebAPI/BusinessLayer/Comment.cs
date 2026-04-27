using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        public int AuthorId { get; set; }
        public User Author { get; set; }
        [JsonIgnore]
        public Post Post { get; set; }
        public int PostId { get; set; }
    }
}
