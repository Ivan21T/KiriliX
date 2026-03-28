using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs
{
    public record CheckOtpDTO(
        string Email,
        string Code,
        DateTime Time
    );
}
