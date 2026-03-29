using BusinessLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.DTOs;
using ServiceLayer.Mapper;
namespace WebAPI.Controllers
{
    [Route("admins")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;
        private readonly OTPCodeService _otpCodeService;
        private readonly JwtService _jwtService;
        public AdminController(AdminService adminService, 
            OTPCodeService otpCodeService, JwtService jwtService)
        {
            _adminService = adminService;
            _otpCodeService = otpCodeService;
            _jwtService = jwtService;
        }

        [HttpGet("otp-code")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOTPCode([FromQuery] string email, int offsetTime)
        {
            try
            {
                if (await _adminService.GetUserByEmail(email) == null)
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
        [AllowAnonymous]
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
        [AllowAnonymous]
        public async Task<IActionResult> VerifyOTPCode([FromBody] CheckOtpDTO checkOtp)
        {
            try
            {
                if (await _otpCodeService.Verify(checkOtp))
                {
                    var user = await _adminService.GetUserByEmail(checkOtp.Email);
                    var token = await _jwtService.GenerateTokenAsync(user);
                    return Ok(new 
                    { 
                        message = "Успешно влизане!",
                        token = token,
                        user=Mapper.ToReadUserDTO(user)
                    });
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
    }
}
