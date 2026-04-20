using DataLayer;
using BCrypt.Net;
using ServiceLayer.DTOs;
using Microsoft.EntityFrameworkCore;
using BusinessLayer;
using System.Security.Cryptography;
using BusinessLayer.Enums;
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
            if(await GetUserByEmailForSignUp(user.Email)!=null)
            {
                throw new Exception("Имейлът вече е регистриран!");
            }
            if(await GetUserByUsername(user.Username)!=null)
            {
                throw new Exception("Потребителското име вече е заето!");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _userContext.CreateAsync(user);
        }
        public async Task<User> GetUserByUsername(string username)
        {
            var users = await _userContext.ReadAllAsync();
            var user = users.FirstOrDefault(u => u.Username == username);
            return user;
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
        public async Task<User> GetUserByEmailForSignUp(string email)
        {
            var users = await _userContext.ReadAllAsync();
            var user = users.FirstOrDefault(u => u.Email == email);
            return user;
        }
        public async Task<List<User>> GetAllUsersAsync(bool useNavigationalProperties = false, bool isReadOnly = false)
        {
            return await _userContext.ReadAllAsync(useNavigationalProperties, isReadOnly);
        }
        public async Task UpdateUserAsync(User user, bool useNavigationalProperties = false)
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            await _userContext.UpdateAsync(user, useNavigationalProperties);
        }
        public async Task<User> SignIn(string email, string password)
        {
            User user = await GetUserByEmail(email,true);
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.Password);
            if (!isPasswordValid)
            {
                throw new Exception("Невалидна парола!");
            }
            return user;
        }
        public async Task ResetPassword(ResetPasswordDTO request)
        {
            var user= await GetUserByEmail(request.Email);
            if (user == null)
            {
                throw new Exception("Потребителят не е намерен!");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _userContext.UpdateAsync(user);
        }
        public async Task<OTPCode> GenerateOTP(string email)
        {
            var user = await GetUserByEmail(email);
            if (user == null)
            {
                throw new Exception("Не съществува потребител с такъв имейл!");
            }

            var code = RandomNumberGenerator
                .GetInt32(0, 1_000_000)
                .ToString("D6");
            var expiryTime = DateTime.UtcNow.AddMinutes(15);

            OTPCode otpCode = new OTPCode(email, code, expiryTime);

            return otpCode;
        }
        public async Task DeleteAsync(int id)
        {
            await _userContext.DeleteAsync(id);
        }
        public async Task PatchUserAsync(int id, Dictionary<string, object> updates)
        {
            var user = await _userContext.ReadAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("Потребителят не е намерен!");
            }

            foreach (var update in updates)
            {
                switch (update.Key.ToLower())
                {
                    case "username":
                        user.Username = update.Value?.ToString() ?? user.Username;
                        break;
                    case "email":
                        user.Email = update.Value?.ToString() ?? user.Email;
                        break;
                    case "password":
                        user.Password = BCrypt.Net.BCrypt.HashPassword(update.Value?.ToString() ?? user.Password);
                        break;
                    case "role":
                        user.Role = (Role)update.Value;
                        break;
                    default:
                        throw new ArgumentException($"Полето '{update.Key}' не може да бъде обновено!");
                }
            }

            await _userContext.UpdateAsync(user);
        }
    }
}
