using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;
using Business_Layer;
using ServiceLayer.DTOs;

namespace ServiceLayer
{
    public class OTPCodeService
    {
        private readonly OTPCodeContext _otpCodeContext;
        public OTPCodeService(OTPCodeContext otpCodeContext)
        {
            _otpCodeContext = otpCodeContext;
        }
        public async Task CreateOTPCodeAsync(OTPCode otpCode)
        {
            await _otpCodeContext.CreateAsync(otpCode);
        }
        public async Task<bool> Verify(CheckOtpDTO checkOTP)
        {
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
