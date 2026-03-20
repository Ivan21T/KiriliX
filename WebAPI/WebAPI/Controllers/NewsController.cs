using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DataLayer;
using BusinessLayer;
using ServiceLayer;
namespace WebAPI.Controllers
{
    [Route("news")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly NewsService _newsService;

        public NewsController(NewsService newsContext)
        {
            _newsService = newsContext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNews(News news)
        {
            try
            {
                await _newsService.CreateNewsAsync(news);
                return Ok(new { message = "Новината е създадена успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            try
            {
                await _newsService.DeleteNewsAsync(id);
                return Ok(new { message = "Новината е изтрита успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetNews()
        {
            try
            {
                List<News> news = await _newsService.GetAllNewsAsync();
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNewsById(int id)
        {
            try
            {
                News news = await _newsService.GetNewsByIdAsync(id);
                if (news == null)
                {
                    return NotFound(new { message = "Новината не е намерена!" });
                }
                return Ok(news);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNews(News news)
        {
            try
            {
                await _newsService.UpdateNewsAsync(news);
                return Ok(new { message = "Новината е обновена успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
