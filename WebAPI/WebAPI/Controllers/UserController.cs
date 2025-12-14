using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using DataLayer;
namespace WebAPI.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        public UserController(UserService userService)
        {
            _userService = userService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user )
        {
            try
            {
                await _userService.CreateUserAsync(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Created();
        }
    }
}
