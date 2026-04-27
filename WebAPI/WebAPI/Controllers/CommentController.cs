using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DataLayer;
using ServiceLayer;
using BusinessLayer;
using ServiceLayer.DTOs;
namespace WebAPI.Controllers
{
    [Route("comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;
        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentById(int id, bool useNavigationalProperties, bool isReadOnly)
        {
            try
            {
                Comment comment = await _commentService.GetCommentByIdAsync(id, useNavigationalProperties, isReadOnly);
                if (comment == null)
                {
                    return NotFound(new { message = "Коментарът не е намерен!" });
                }
                return Ok(comment);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] Comment comment)
        {
            try
            {
                await _commentService.CreateCommentAsync(comment);
                return Ok(new { message = "Коментарът е създаден успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                await _commentService.DeleteCommentAsync(id);
                return Ok(new { message = "Коментарът е изтрит успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
    }
}
