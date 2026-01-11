using Business_Layer;
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

        public Task CreateAsync(Comment item)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Comment>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            throw new NotImplementedException();
        }

        public Task<Comment> ReadAsync(int id, bool useNavigationProperties = false, bool isReadOnly = false)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(Comment entity, bool useNavigationProperties = false)
        {
            throw new NotImplementedException();
        }
    }
}
