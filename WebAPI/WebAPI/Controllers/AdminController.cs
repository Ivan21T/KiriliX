using Business_Layer;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using DataLayer;
using Microsoft.AspNetCore.Http.HttpResults;
using BusinessLayer;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("admin")]
    public class AdminController : ControllerBase
    {
        private readonly PostService _postService;
        private readonly UserService _userService;
        public AdminController(PostService postService, UserService userService)
        {
            _postService = postService;
            _userService = userService;
        }
        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteAsync(id);
                return Ok(new { message = "Потребителят е изтрит успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("get-users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                List<User> users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
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
    }
}
