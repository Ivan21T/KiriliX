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
    public class NewsContextTests : TestBase
    {
        private KirilixDbContext _dbContext;
        private NewsContext _newsContext;

        [SetUp]
        public void Setup()
        {
            _dbContext = GetDbContext(Guid.NewGuid().ToString());
            _newsContext = new NewsContext(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        [Test]
        public async Task CreateAsync_ValidNews_AddsNewsToDatabase()
        {
            var news = new News("Title 1", "Description 1", DateTime.Now);
            await _newsContext.CreateAsync(news);
            var count = await _dbContext.News.CountAsync();
            Assert.That(count, Is.EqualTo(1));
        }

        [Test]
        public async Task ReadAsync_ExistingNewsId_ReturnsNews()
        {
            var news = new News("Title 1", "Description 1", DateTime.Now);
            _dbContext.News.Add(news);
            await _dbContext.SaveChangesAsync();

            var result = await _newsContext.ReadAsync(news.Id);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(news.Id));
        }

        [Test]
        public void ReadAsync_NonExistingId_ThrowsException()
        {
            Assert.ThrowsAsync<Exception>(() => _newsContext.ReadAsync(999));
        }

        [Test]
        public async Task ReadAllAsync_ReturnsAllNews()
        {
            _dbContext.News.Add(new News("T1", "D1", DateTime.Now));
            _dbContext.News.Add(new News("T2", "D2", DateTime.Now));
            await _dbContext.SaveChangesAsync();

            var newsList = await _newsContext.ReadAllAsync();

            Assert.That(newsList.Count, Is.EqualTo(2));
        }

        [Test]
        public async Task UpdateAsync_ValidNews_UpdatesNewsInDatabase()
        {
            var news = new News("Title 1", "Description 1", DateTime.Now);
            _dbContext.News.Add(news);
            await _dbContext.SaveChangesAsync();

            news.Title = "Updated Title";
            await _newsContext.UpdateAsync(news);

            var updatedNews = await _dbContext.News.FindAsync(news.Id);
            Assert.That(updatedNews.Title, Is.EqualTo("Updated Title"));
        }

        [Test]
        public async Task DeleteAsync_ExistingNewsId_DeletesNews()
        {
            var news = new News("Title 1", "Description 1", DateTime.Now);
            _dbContext.News.Add(news);
            await _dbContext.SaveChangesAsync();

            await _newsContext.DeleteAsync(news.Id);

            var count = await _dbContext.News.CountAsync();
            Assert.That(count, Is.EqualTo(0));
        }
    }
}
