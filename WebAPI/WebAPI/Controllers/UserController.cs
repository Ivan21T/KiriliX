using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using DataLayer;
using ServiceLayer.DTOs;
using BusinessLayer;
namespace WebAPI.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly OTPCodeService _otpCodeService;
        public UserController(UserService userService, OTPCodeService otpCodeService)
        {
            _userService = userService;
            _otpCodeService = otpCodeService;
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
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> SignUp([FromBody] User user)
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
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Имейл и парола са задължителни!" });
                }

                User user = await _userService.SignIn(request.Email, request.Password);
                return Ok(new
                {
                    message = "Успешно влизане!",
                    user = user
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("otp-code")]
        public async Task<IActionResult> GetOTPCode([FromQuery] string email, int offsetTime)
        {
            try
            {
                if (await _userService.GetUserByEmail(email) == null)
                {
                    return BadRequest();
                }
                var otpCode = await _otpCodeService.GenerateAndSendOTPAsync(email, offsetTime);

                return Ok(new
                {
                    message = "OTP кодът е изпратен успешно!"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("resend")]
        public async Task<IActionResult> ResendOTPCode([FromQuery] string email, int offsetTime)
        {
            try
            {
                var otpCode = await _otpCodeService.ResendAsync(email, offsetTime);
                return Ok(new
                {
                    message = "OTP кодът е препратен успешно!"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOTPCode([FromBody] CheckOtpDTO checkOtp)
        {
            try
            {
                if (await _otpCodeService.Verify(checkOtp))
                {
                    return Ok(new { message = "OTP кодът е валиден!" });
                }
                else
                {
                    return BadRequest(new { message = "OTP кодът е невалиден или изтекъл!" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO resetPasswordDTO)
        {
            try
            {
                await _userService.ResetPassword(resetPasswordDTO);
                return Ok(new { message = "Паролата е нулирана успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            try
            {
                await _userService.UpdateUserAsync(user);
                return Ok(new { message = "Потребителят е обновен успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchUser(int id, [FromBody] Dictionary<string, object> updates)
        {
            try
            {
                if (updates == null || updates.Count == 0)
                {
                    return BadRequest(new { message = "Няма подадени полета за обновяване!" });
                }

                await _userService.PatchUserAsync(id, updates);
                return Ok(new { message = "Потребителят е обновен успешно!" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
