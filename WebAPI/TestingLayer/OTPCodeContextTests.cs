using NUnit.Framework;
using BusinessLayer;
using DataLayer;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace TestingLayer
{
    [TestFixture]
    public class OTPCodeContextTests : TestBase
    {
        private KirilixDbContext _dbContext;
        private OTPCodeContext _otpCodeContext;

        [SetUp]
        public void Setup()
        {
            _dbContext = GetDbContext(Guid.NewGuid().ToString());
            _otpCodeContext = new OTPCodeContext(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateAsync_ValidOTPCode_AddsOTPCodeToDatabase()
        {
            var otp = new OTPCode("test@test.com", "123456", DateTime.Now.AddMinutes(5));
            await _otpCodeContext.CreateAsync(otp);
            var count = await _dbContext.OTPCodes.CountAsync();
            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task ReadAsync_ExistingOTPCodeId_ReturnsOTPCode()
        {
            var otp = new OTPCode("test@test.com", "123456", DateTime.Now.AddMinutes(5));
            _dbContext.OTPCodes.Add(otp);
            await _dbContext.SaveChangesAsync();

            var result = await _otpCodeContext.ReadAsync(otp.Id);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(otp.Id));
        }

        [Test]
        public void ReadAsync_NonExistingId_ThrowsException()
        {
            Assert.ThrowsAsync<Exception>(() => _otpCodeContext.ReadAsync(999));
        }

        [Test]
        public async Task ReadAllAsync_ReturnsAllOTPCodes()
        {
            _dbContext.OTPCodes.Add(new OTPCode("1@e.c", "111", DateTime.Now.AddMinutes(5)));
            _dbContext.OTPCodes.Add(new OTPCode("2@e.c", "222", DateTime.Now.AddMinutes(5)));
            await _dbContext.SaveChangesAsync();

            var otpList = await _otpCodeContext.ReadAllAsync();

            Assert.That(otpList.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task UpdateAsync_ValidOTPCode_UpdatesOTPCodeInDatabase()
        {
            var otp = new OTPCode("test@test.com", "123456", DateTime.Now.AddMinutes(5));
            _dbContext.OTPCodes.Add(otp);
            await _dbContext.SaveChangesAsync();

            otp.Code = "654321";
            await _otpCodeContext.UpdateAsync(otp);

            var updatedOTPCode = await _dbContext.OTPCodes.FindAsync(otp.Id);
            Assert.That(updatedOTPCode.Code, Is.EqualTo("654321"));
        }

        [Test]
        public async Task DeleteAsync_ExistingOTPCodeId_DeletesOTPCode()
        {
            var otp = new OTPCode("test@test.com", "123456", DateTime.Now.AddMinutes(5));
            _dbContext.OTPCodes.Add(otp);
            await _dbContext.SaveChangesAsync();

            await _otpCodeContext.DeleteAsync(otp.Id);

            var count = await _dbContext.OTPCodes.CountAsync();
            Assert.That(count, Is.EqualTo(0));
        }
    }
}
