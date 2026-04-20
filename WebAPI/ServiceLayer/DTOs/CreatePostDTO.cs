using BusinessLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs
{
    public record CreatePostDTO(string Title,
    string Content,
    DateTime CreatedAt,
    User Author,
    List<Comment> Comments);
}
