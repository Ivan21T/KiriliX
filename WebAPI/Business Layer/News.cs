using DataLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business_Layer
{
    public class News
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public DateTime PublishedAt { get; set; }
        public int Views { get; set; }
        [Required]
        public User Author { get; set; }
        public byte TimeToRead { get; set; }
        public News()
        {
        }

        public News(string description,DateTime publishedAt,User author,byte timeToRead)
        {
            Description = description;
            PublishedAt = publishedAt;
            Author = author;
            TimeToRead = timeToRead;
            Views = 0;
        }
    }
}
