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
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                List<User> users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> SignUp([FromBody] User user )
        {
            try
            {
                await _userService.CreateUserAsync(user);
                return Ok(new { message = "Потребителят е създаден успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] string email,string password)
        {
            try
            {
                User user = await _userService.SignIn(email, password);
                return Ok(new {message="Успешно влизане!"});
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
