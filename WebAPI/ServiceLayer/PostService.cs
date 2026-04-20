using AutoMapper;
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
        public async Task<List<Post>> GetPostsByUserIdAsync(int userId, bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            try
            {
                var posts = await _postContext.ReadAllAsync(useNavigationalProperties, isReadOnly);
                return posts.FindAll(p => p.Author.Id == userId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Грешка при взимане на публикациите за потребител с ID {userId}: {ex.Message}", ex);
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
        public async Task UpdatePostAsync(Post post)
        {
            await _postContext.UpdateAsync(post);
        }

        public async Task DeleteAsync(int id)
        {
            await _postContext.DeleteAsync(id);
        }
        public async Task PatchPostAsync(int id, Dictionary<string,object> updates)
        {
            var post = await _postContext.ReadAsync(id);
            if (post == null)
            {
                throw new KeyNotFoundException("Публикацията не е намерена!");
            }

            foreach (var update in updates)
            {
                switch (update.Key.ToLower())
                {
                    case "title":
                        post.Title = update.Value?.ToString() ?? post.Title;
                        break;
                    case "content":
                        post.Content = update.Value?.ToString() ?? post.Content;
                        break;
                    default:
                        throw new ArgumentException($"Полето '{update.Key}' не може да бъде обновено!");
                }
            }

            await _postContext.UpdateAsync(post);
        }
    }
}