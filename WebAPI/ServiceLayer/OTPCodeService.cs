using Business_Layer;
using DataLayer;
using ServiceLayer.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class OTPCodeService
    {
        private readonly OTPCodeContext _otpCodeContext;
        private readonly EmailService _emailService;
        public OTPCodeService(OTPCodeContext otpCodeContext, EmailService emailService)
        {
            _otpCodeContext = otpCodeContext;
            _emailService = emailService;
        }
        public async Task CreateOTPCodeAsync(OTPCode otpCode)
        {
            await _otpCodeContext.CreateAsync(otpCode);
        }
        public async Task<OTPCode> GenerateAndSendOTPAsync(string email,int offsetTime)
        {
            var code = RandomNumberGenerator
                .GetInt32(0, 1_000_000)
                .ToString("D6");
            var expiryTime = DateTime.UtcNow.AddMinutes(15).AddMinutes(offsetTime);

            OTPCode otpCode = new OTPCode(email, code, expiryTime);

            await _otpCodeContext.CreateAsync(otpCode);

            await _emailService.SendOtpEmail(email, code,expiryTime);

            return otpCode;
        }
        public async Task<bool> Verify(CheckOtpDTO checkOTP)
        {
            await CleanupExpiredOTPCodesAsync();
            var otpCodes = await _otpCodeContext.ReadAllAsync();
            var otpCode = otpCodes.FirstOrDefault(o => o.Email == checkOTP.Email && o.Code == checkOTP.Code);

            if (otpCode == null)
            {
                return false;
            }

            if (DateTime.UtcNow > otpCode.ExpiryTime)
            {
                await DeleteOTPCodeAsync(otpCode.Id);
                return false;
            }

            await DeleteOTPCodeAsync(otpCode.Id);
            return true;
        }
        public async Task DeleteOTPCodeAsync(int id)
        {
            await _otpCodeContext.DeleteAsync(id);
        }
        public async Task CleanupExpiredOTPCodesAsync()
        {
            var otpCodes = await _otpCodeContext.ReadAllAsync();
            var expiredCodes = otpCodes.Where(o => DateTime.UtcNow > o.ExpiryTime).ToList();

            foreach (var expiredCode in expiredCodes)
            {
                await DeleteOTPCodeAsync(expiredCode.Id);
            }
        }
    }
}
