using NUnit.Framework;
using BusinessLayer;
using BusinessLayer.Enums;
using DataLayer;
using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace TestingLayer
{
    [TestFixture]
    public class UserContextTests : TestBase
    {
        private KirilixDbContext _dbContext;
        private UserContext _userContext;

        [SetUp]
        public void Setup()
        {
            _dbContext = GetDbContext(Guid.NewGuid().ToString());
            _userContext = new UserContext(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateAsync_ValidUser_AddsUserToDatabase()
        {
            var user = new User { Username = "TestUser", Email = "test@test.com", Password = "password123", Role = Role.User };
            await _userContext.CreateAsync(user);
            var usersCount = await _dbContext.Users.CountAsync();
            Assert.That(usersCount, Is.EqualTo(1));
        }

        [Test]
        public async Task ReadAsync_ExistingUserId_ReturnsUser()
        {
            var user = new User { Username = "ExistingUser", Email = "e@test.com", Password = "123", Role = Role.User };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            var result = await _userContext.ReadAsync(user.Id);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(user.Id));
        }

        [Test]
        public void ReadAsync_NonExistingId_ThrowsException()
        {
            Assert.ThrowsAsync<Exception>(() => _userContext.ReadAsync(999));
        }

        [Test]
        public async Task ReadAllAsync_ReturnsAllUsers()
        {
            _dbContext.Users.Add(new User { Username = "U1", Email = "1@e.c", Password = "1", Role = Role.User });
            _dbContext.Users.Add(new User { Username = "U2", Email = "2@e.c", Password = "2", Role = Role.User });
            await _dbContext.SaveChangesAsync();

            var users = await _userContext.ReadAllAsync();

            Assert.That(users.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task UpdateAsync_ValidUser_UpdatesUserInDatabase()
        {
            var user = new User { Username = "U1", Email = "1@e.c", Password = "1", Role = Role.User };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            user.Username = "Updated";
            await _userContext.UpdateAsync(user);

            var updatedUser = await _dbContext.Users.FindAsync(user.Id);
            Assert.That(updatedUser.Username, Is.EqualTo("Updated"));
        }

        [Test]
        public async Task DeleteAsync_ExistingUserId_DeletesUser()
        {
            var user = new User { Username = "U1", Email = "1@e.c", Password = "1", Role = Role.User };
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();

            await _userContext.DeleteAsync(user.Id);

            var count = await _dbContext.Users.CountAsync();
            Assert.That(count, Is.EqualTo(0));
        }
    }
}
