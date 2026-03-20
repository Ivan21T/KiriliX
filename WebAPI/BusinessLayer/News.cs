using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer
{
    public class News
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Title { get; set; }   
        [Required]
        public DateTime PublishedAt { get; set; }
        public News()
        {
        }

        public News(string title,string description,DateTime publishedAt)
        {
            Title = title;
            Description = description;
            PublishedAt = publishedAt;
        }
    }
}
