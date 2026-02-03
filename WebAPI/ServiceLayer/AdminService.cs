
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;
namespace ServiceLayer
{
    public class AdminService
    {
        private readonly UserContext _userContext;
        private readonly PostContext _postContext;
        public AdminService(UserContext userContext, PostContext postContext)
        {
            _userContext = userContext;
            _postContext = postContext;
        }
        public async Task<List<User>> GetAllUsersAsync(bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            return await _userContext.ReadAllAsync(useNavigationalProperties, isReadOnly);
        }
        public async Task CreateUser(User user)
        {
            await _userContext.CreateAsync(user);
        }
    }
}
