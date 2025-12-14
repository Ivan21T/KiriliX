using DataLayer;
using BCrypt.Net;
namespace ServiceLayer
{
    public class UserService
    {
        private readonly UserContext _userContext;

        public UserService(UserContext userContext)
        {
            _userContext = userContext;
        }
        public async Task CreateUserAsync(User user)
        {
           await _userContext.CreateAsync(user);
        }
        public async Task<User> GetUserByIdAsync(int id, bool useNavigationalProperties = false,bool isReadOnly = false)
        {
            return await _userContext.ReadAsync(id, useNavigationalProperties, isReadOnly);
        }
        public async Task<User> GetUserByEmail(string email,bool useNavigationalProperties = false,bool isReadOnly=false)
        {
            var users = await _userContext.ReadAllAsync(useNavigationalProperties,isReadOnly);
            var user = users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                throw new Exception("Невалиден имейл или несъществуващ потребител!");
            }
            return user;
        }
        public async Task<List<User>> GetAllUsersAsync(bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            return await _userContext.ReadAllAsync(useNavigationalProperties, isReadOnly);
        }
        public async Task UpdateUserAsync(User user, bool useNavigationalProperties = false)
        {
            await _userContext.UpdateAsync(user, useNavigationalProperties);
        }
        public async Task DeleteUserAsync(int id)
        {
            await _userContext.DeleteAsync(id);
        }
        public async Task<User> SignIn(string email, string password)
        {
            User user = await GetUserByEmail(email);
            if (user.Password != password)
            {
                throw new Exception("Невалидна парола!");
            }
            return user;
        }
    }
}
