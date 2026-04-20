using Microsoft.EntityFrameworkCore;
using BusinessLayer;
using DataLayer.Repositories;
namespace DataLayer
{
    public class UserContext:IDb<User,int>
    {
        private readonly KirilixDbContext _context;
        public UserContext(KirilixDbContext context)
        {
            _context = context;
        }
        public async Task CreateAsync(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }
            user.CreatedAt = DateTime.UtcNow;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
        public async Task<User> ReadAsync(int id, bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<User> query = _context.Users;
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            if (useNavigationProperties)
            {
                query=query.Include(u=>u.Posts).Include(u=>u.Comments);
            }
            User user = await query.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new Exception("Потребителят не е намерен!");
            }
            return user;
        }
        public async Task<List<User>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<User> query = _context.Users;
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            if (useNavigationProperties)
            {
                query=query.Include(u=>u.Posts).Include(u=>u.Comments);
            }
            return await query.ToListAsync();
        }
        public async Task UpdateAsync(User item,bool useNavigationalProperties=false)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == item.Id);

            if (existingUser == null)
            {
                throw new Exception("Потребителят не е намерен!");
            }
            existingUser.Email=item.Email;
            existingUser.Username=item.Username;
            existingUser.Password=item.Password;
            existingUser.Role=item.Role;

            if (useNavigationalProperties)
            {
                List<Post> postsToUpdate = new List<Post>();
                List<Comment> commentsToUpdate = new List<Comment>();
                foreach (var comment in item.Comments)
                {
                    var existingComment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == comment.Id);
                    if (existingComment != null)
                    {
                        commentsToUpdate.Add(existingComment);
                    }
                    else
                    {
                        commentsToUpdate.Add(comment);
                    }
                }
                foreach (var post in item.Posts)
                {
                    var existingPost = await _context.Posts.FirstOrDefaultAsync(p => p.Id == post.Id);
                    if (existingPost != null)
                    {
                        postsToUpdate.Add(existingPost);
                    }
                    else
                    {
                        postsToUpdate.Add(post);
                    }
                }
                existingUser.Posts = postsToUpdate;
                existingUser.Comments = commentsToUpdate;
            }

            await _context.SaveChangesAsync();
        }
        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                throw new Exception("Потребителят не е намерен!");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
