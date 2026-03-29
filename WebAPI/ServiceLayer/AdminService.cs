using BusinessLayer;
using DataLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer
{
    public class AdminService
    {
        private readonly UserContext _userContext;
        public AdminService(UserContext userContext)
        {
            _userContext = userContext;
        }
        public async Task<User> GetUserByEmail(string email, bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            var users = await _userContext.ReadAllAsync(useNavigationalProperties, isReadOnly);
            var user = users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                throw new Exception("Невалиден имейл или несъществуващ потребител!");
            }
            return user;
        }
    }
}
