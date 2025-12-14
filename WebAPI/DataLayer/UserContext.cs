using Microsoft.EntityFrameworkCore;

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
            User user = await query.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new Exception("User not found!");
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
            return await query.ToListAsync();
        }
        public async Task UpdateAsync(User item,bool useNavigationalProperties=false)
        {
            
        }
        public async Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
