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
    public class PostContextTests : TestBase
    {
        private KirilixDbContext _dbContext;
        private PostContext _postContext;

        [SetUp]
        public void Setup()
        {
            _dbContext = GetDbContext(Guid.NewGuid().ToString());
            _postContext = new PostContext(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateAsync_ValidPost_AddsPostToDatabase()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            await _postContext.CreateAsync(post);
            var count = await _dbContext.Posts.CountAsync();
            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task ReadAsync_ExistingPostId_ReturnsPost()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            _dbContext.Posts.Add(post);
            await _dbContext.SaveChangesAsync();

            var result = await _postContext.ReadAsync(post.Id);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(post.Id));
        }

        [Test]
        public void ReadAsync_NonExistingId_ThrowsException()
        {
            Assert.ThrowsAsync<Exception>(() => _postContext.ReadAsync(999));
        }

        [Test]
        public async Task ReadAllAsync_ReturnsAllPosts()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            _dbContext.Posts.Add(new Post { Title = "T1", Content = "C1", Author = user });
            _dbContext.Posts.Add(new Post { Title = "T2", Content = "C2", Author = user });
            await _dbContext.SaveChangesAsync();

            var posts = await _postContext.ReadAllAsync();

            Assert.That(posts.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task UpdateAsync_ValidPost_UpdatesPostInDatabase()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            _dbContext.Posts.Add(post);
            await _dbContext.SaveChangesAsync();

            post.Title = "Updated Title";
            await _postContext.UpdateAsync(post);

            var updatedPost = await _dbContext.Posts.FindAsync(post.Id);
            Assert.That(updatedPost.Title, Is.EqualTo("Updated Title"));
        }

        [Test]
        public async Task DeleteAsync_ExistingPostId_DeletesPost()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            _dbContext.Posts.Add(post);
            await _dbContext.SaveChangesAsync();

            await _postContext.DeleteAsync(post.Id);

            var count = await _dbContext.Posts.CountAsync();
            Assert.That(count, Is.EqualTo(0));
        }
    }
}
