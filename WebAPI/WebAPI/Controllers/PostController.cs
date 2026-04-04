using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer;
using ServiceLayer.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessLayer;
namespace WebAPI.Controllers
{
    [Route("post")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly PostService _postService;

        public PostController(PostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] bool useNavigationalProperties = false, [FromQuery] bool isReadOnly = false)
        {
            try
            {
                List<Post> posts = await _postService.GetPostsAsync(useNavigationalProperties, isReadOnly);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id, [FromQuery] bool useNavigationalProperties = false, [FromQuery] bool isReadOnly = false)
        {
            try
            {
                Post post = await _postService.GetPostByIdAsync(id, useNavigationalProperties, isReadOnly);
                if (post == null)
                {
                    return NotFound(new { message = "Публикацията не е намерена!" });
                }
                return Ok(post);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] Post post)
        {
            try
            {
                await _postService.CreatePostAsync(post);
                return Ok(new { message = "Публикацията е създадена успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            try
            {
                await _postService.DeleteAsync(id);
                return Ok(new { message = "Публикацията е изтрита успешно!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}