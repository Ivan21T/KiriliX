using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Business_Layer;
using Microsoft.EntityFrameworkCore;

namespace DataLayer
{
    public class PostContext : IDb<Post, int>
    {
        private readonly KirilixDbContext _context;
        public PostContext(KirilixDbContext context)
        {
            _context = context;
        }
        public async Task CreateAsync(Post item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }
            await _context.Posts.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
            if (post == null)
            {
                throw new Exception("Публикацията не е намерена!");
            }
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }

        public Task<List<Post>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<Post> query = _context.Posts;
            if (useNavigationProperties)
            {
                query = query
                    .Include(p => p.Author)
                    .Include(p => p.Comments)
                    .ThenInclude(c => c.Author);
            }
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            return query.ToListAsync();
        }

        public Task<Post> ReadAsync(int id, bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<Post> query = _context.Posts;
            if (useNavigationProperties)
            {
                query = query
                    .Include(p => p.Author)
                    .Include(p => p.Comments)
                    .ThenInclude(c => c.Author);
            }
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            var post=query.FirstOrDefaultAsync(u => u.Id == id);
            if (post == null)
            {
                throw new Exception("Публикацията не е намерена!");
            }
            return post;
        }

        public async Task UpdateAsync(Post entity, bool useNavigationProperties = false)
        {
            var existingPost = await _context.Posts
                .FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (existingPost == null)
            {
                throw new Exception("Публикацията не е намерена!");
            }
            _context.Entry(existingPost).CurrentValues.SetValues(entity);
            if(useNavigationProperties)
            {
                List<Comment> comments = new List<Comment>();
                
                foreach (var comment in entity.Comments)
                {
                    var existingComment=await _context.Comments
                        .FirstOrDefaultAsync(c => c.Id == comment.Id);
                    if (existingComment != null)
                    {
                        comments.Add(existingComment);
                    }
                    else
                    {
                        comments.Add(comment);
                    }
                }
                existingPost.Comments = comments;
            }
            await _context.SaveChangesAsync();
        }
    }
}
