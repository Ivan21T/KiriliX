using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;
using Business_Layer;

namespace ServiceLayer
{
    public class CommentService
    {
        private readonly CommentContext _commentContext;
        public CommentService(CommentContext commentContext)
        {
            _commentContext = commentContext;
        }
        public async Task CreateCommentAsync(Comment comment)
        {
            await _commentContext.CreateAsync(comment);
        }
        public async Task<Comment> GetCommentByIdAsync(int id)
        {
            return await _commentContext.ReadAsync(id);
        }
        public async Task<List<Comment>> GetAllCommentsAsync()
        {
            return await _commentContext.ReadAllAsync();
        }
        public async Task UpdateCommentAsync(Comment comment)
        {
            await _commentContext.UpdateAsync(comment);
        }
        public async Task DeleteCommentAsync(int id)
        {
            await _commentContext.DeleteAsync(id);
        }
    }
}
