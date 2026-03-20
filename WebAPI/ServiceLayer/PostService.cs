using AutoMapper;
using Business_Layer;
using DataLayer;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BusinessLayer;
namespace ServiceLayer
{
    public class PostService
    {
        private readonly PostContext _postContext;

        public PostService(PostContext postContext)
        {
            _postContext = postContext;
        }

        public async Task CreatePostAsync(Post post)
        {
            await _postContext.CreateAsync(post);
        }

        public async Task<List<Post>> GetPostsAsync(bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            try
            {
                var posts = await _postContext.ReadAllAsync(useNavigationalProperties, isReadOnly);
                return posts;
            }
            catch (Exception ex)
            {
                throw new Exception($"Грешка при взимане на публикациите: {ex.Message}", ex);
            }
        }

        public async Task<Post> GetPostByIdAsync(int id, bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            try
            {
                var post = await _postContext.ReadAsync(id, useNavigationalProperties, isReadOnly);
                return post;

            }
            catch (Exception ex)
            {
                throw new Exception($"Грешка при взимане на публикация с ID {id}: {ex.Message}", ex);
            }
        }

        public async Task DeleteAsync(int id)
        {
            await _postContext.DeleteAsync(id);
        }
    }
}