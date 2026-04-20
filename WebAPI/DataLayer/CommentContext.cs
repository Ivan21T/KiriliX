using BusinessLayer;
using DataLayer.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer
{
    public class CommentContext:IDb<Comment, int>
    {
        private readonly KirilixDbContext _context;
        public CommentContext(KirilixDbContext context)
        {
            _context = context;
        }

        public async Task CreateAsync(Comment item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("Неуспешно добавяне!");
            }
            var user= await _context.Users.FindAsync(item.Author.Id);
            if (user!=null)
            {
                item.Author = user;
            }
            var post = await _context.Posts.FindAsync(item.PostId);
            if (post!=null)
            {
                item.Post = post;
            }
            item.CreatedAt = DateTime.UtcNow;
            _context.Comments.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if(comment==null)
                {
                throw new Exception("Коментарът не е намерен!");
            }
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Comment>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<Comment> query = _context.Comments;
            if (useNavigationProperties)
            {
                query = query.Include(c => c.Author).Include(c => c.Post);
            }
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            return await query.ToListAsync();
        }

        public async Task<Comment> ReadAsync(int id, bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<Comment> query = _context.Comments;
            if (useNavigationProperties)
            {
                query = query.Include(c => c.Author).Include(c => c.Post);
            }
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            var comment = query.FirstOrDefault(c => c.Id == id);
            if (comment == null)
            {
                throw new Exception("Коментарът не е намерен!");
            }
            return comment;
        }

        public async Task UpdateAsync(Comment entity, bool useNavigationProperties = false)
        {
            var existingComment = await _context.Comments.FindAsync(entity.Id);
            existingComment.Content = entity.Content;
            if (useNavigationProperties)
            {
                var user = await _context.Users.FindAsync(entity.Author.Id);
                if (user != null)
                {
                    existingComment.Author = user;
                }
                else
                {
                    existingComment.Author = entity.Author;
                }
                var post = await _context.Posts.FindAsync(entity.Post.Id);
                if (post != null)
                {
                    existingComment.Post = post;
                }
                else
                {
                    existingComment.Post = entity.Post;
                }
            }
            await _context.SaveChangesAsync();
        }
    }
}
