using BusinessLayer.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs
{
    public record ReadUserDTO(
        int Id,
        string Username,
        string Email,
        Role Role,
        DateTime CreatedAt
    );
}
