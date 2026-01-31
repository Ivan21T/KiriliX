using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using DataLayer;
using ServiceLayer.DTOs;
namespace WebAPI.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly OTPCodeService _otpCodeService;
        public UserController(UserService userService,OTPCodeService otpCodeService)
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
                return Ok(new {message="Успешно влизане!",user=user});
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("otp-code")]
        public async Task<IActionResult> GetOTPCode([FromQuery] string email)
        {
            try
            {
                var otpCode = await _userService.SendOTP(email); 
                await _otpCodeService.CreateOTPCodeAsync(otpCode); 
                return Ok(new {otpCode=otpCode });
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
    }
}
