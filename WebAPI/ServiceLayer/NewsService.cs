using BusinessLayer;
using DataLayer;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace ServiceLayer
{
    public class NewsService
    {
        private readonly NewsContext _newsContext;
        private readonly IWebHostEnvironment _environment;

        public NewsService(NewsContext newsContext)
        {
            _newsContext = newsContext;
        }

        public async Task CreateNewsAsync(News news)
        {
            await _newsContext.CreateAsync(news);
        }
        public async Task DeleteNewsAsync(int id)
        {
            await _newsContext.DeleteAsync(id);
        }
        public async Task UpdateNewsAsync(News news)
        {
            await _newsContext.UpdateAsync(news);
        }

        public async Task<List<News>> GetAllNewsAsync()
        {
            return await _newsContext.ReadAllAsync();
        }
        public async Task<News> GetNewsByIdAsync(int id)
        {
            return await _newsContext.ReadAsync(id);
        }
    }
}
