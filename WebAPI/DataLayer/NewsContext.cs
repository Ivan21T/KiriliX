using Business_Layer;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer
{
    public class NewsContext:IDb<News,int>
    {
        private readonly KirilixDbContext _context;
        public NewsContext(KirilixDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(News item)
        {
            if (item == null)
            {
                throw new Exception("Неуспешно създаване на новина");
            }
            await _context.News.AddAsync(item);
        }

        public async Task DeleteAsync(int id)
        {
            var news = await _context.News.FirstOrDefaultAsync(n => n.Id == id);
            if (news == null)
            {
                throw new Exception("Новината не бе намерена!");
            }
            _context.News.Remove(news);
        }

        public async Task<List<News>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<News> query = _context.News;
            if (useNavigationProperties)
            {
                query = query.Include(n => n.Author);
            }
            if(isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            return await query.ToListAsync();
        }

        public async Task<News> ReadAsync(int id, bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<News> query = _context.News;
            if (useNavigationProperties)
            {
                query = query.Include(n => n.Author);
            }
            if(isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            var news = await query.FirstOrDefaultAsync(n => n.Id == id);
            if (news==null)
            {
                throw new Exception("Търсената новина не бе намерена!");
            }
            return news;
        }

        public async Task UpdateAsync(News entity, bool useNavigationProperties = false)
        {
            var newsFromDb = await _context.News.FirstOrDefaultAsync(n => n.Id == entity.Id);
            if (newsFromDb == null)
            {
                throw new Exception("Новината не бе намерена!");
            }
            newsFromDb.Description = entity.Description;
            newsFromDb.PublishedAt = entity.PublishedAt;
            newsFromDb.Views = entity.Views;
            newsFromDb.TimeToRead = entity.TimeToRead;
            if (useNavigationProperties)
            {
                var authorFromDb = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.Author.Id);
                if (authorFromDb == null)
                {
                    throw new Exception("Авторът не бе намерен!");
                }
                newsFromDb.Author = authorFromDb;
            }
        }
    }
}
