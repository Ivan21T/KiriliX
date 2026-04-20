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
    public class CommentContextTests : TestBase
    {
        private KirilixDbContext _dbContext;
        private CommentContext _commentContext;

        [SetUp]
        public void Setup()
        {
            _dbContext = GetDbContext(Guid.NewGuid().ToString());
            _commentContext = new CommentContext(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateAsync_ValidComment_AddsCommentToDatabase()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            var comment = new Comment { Content = "C1", Author = user, Post = post };
            await _commentContext.CreateAsync(comment);
            var count = await _dbContext.Comments.CountAsync();
            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task ReadAsync_ExistingCommentId_ReturnsComment()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            var comment = new Comment { Content = "C1", Author = user, Post = post };
            _dbContext.Comments.Add(comment);
            await _dbContext.SaveChangesAsync();

            var result = await _commentContext.ReadAsync(comment.Id);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(comment.Id));
        }

        [Test]
        public void ReadAsync_NonExistingId_ThrowsException()
        {
            Assert.ThrowsAsync<Exception>(() => _commentContext.ReadAsync(999));
        }

        [Test]
        public async Task ReadAllAsync_ReturnsAllComments()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            _dbContext.Comments.Add(new Comment { Content = "C1", Author = user, Post = post });
            _dbContext.Comments.Add(new Comment { Content = "C2", Author = user, Post = post });
            await _dbContext.SaveChangesAsync();

            var comments = await _commentContext.ReadAllAsync();

            Assert.That(comments.Count, Is.EqualTo(2));
        }

        [Test]
        public void UpdateAsync_ThrowsNotImplementedException()
        {
            // Inside CommentContext UpdateAsync is implemented as throwing NotImplementedException
            Assert.ThrowsAsync<NotImplementedException>(() => _commentContext.UpdateAsync(new Comment()));
        }

        [Test]
        public async Task DeleteAsync_ExistingCommentId_DeletesComment()
        {
            var user = new User { Username = "User", Email = "u@test.com", Password = "123", Role = Role.User };
            var post = new Post { Title = "Test Title", Content = "Test Content", Author = user };
            var comment = new Comment { Content = "C1", Author = user, Post = post };
            _dbContext.Comments.Add(comment);
            await _dbContext.SaveChangesAsync();

            await _commentContext.DeleteAsync(comment.Id);

            var count = await _dbContext.Comments.CountAsync();
            Assert.That(count, Is.EqualTo(0));
        }
    }
}
