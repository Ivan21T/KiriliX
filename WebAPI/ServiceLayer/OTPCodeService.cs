using Business_Layer;
using DataLayer;
using Org.BouncyCastle.Asn1.Mozilla;
using ServiceLayer.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
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

        public async Task DeleteByEmail(string email)
        {
            await CleanupExpiredOTPCodesAsync();
            var otpCode = (await _otpCodeContext.ReadAllAsync())
                .FirstOrDefault(o => o.Email == email);
            if (otpCode == null)
            {
                throw new Exception("OTP код за този имейл не съществува!");
            }
            await _otpCodeContext.DeleteAsync(otpCode.Id);
        }
        public async Task<OTPCode> GenerateAndSendOTPAsync(string email,int offsetTime)
        {
            await CleanupExpiredOTPCodesAsync();
            var code = RandomNumberGenerator
                .GetInt32(0, 1_000_000)
                .ToString("D6");
            var expiryTime = DateTime.UtcNow.AddMinutes(15).AddMinutes(offsetTime);

            OTPCode otpCode = new OTPCode(email, code, expiryTime);

            await _otpCodeContext.CreateAsync(otpCode);

            await _emailService.SendOtpEmail(email, code,expiryTime);

            return otpCode;
        }
        public async Task <OTPCode> ResendAsync(string email, int offsetTime)
        {
            await DeleteByEmail(email);
            return await GenerateAndSendOTPAsync(email, offsetTime);
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
