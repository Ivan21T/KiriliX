using BusinessLayer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ServiceLayer.DTOs;
using BusinessLayer.Enums;

namespace ServiceLayer
{
    public class JwtService
    {
        private readonly string _secretKey;
        private readonly int _expirationHours;
        private readonly UserService _userService; 

        public JwtService(IConfiguration configuration, UserService userService) 
        {
            _secretKey = configuration["Jwt:SecretKey"];
            _expirationHours = int.Parse(configuration["Jwt:ExpirationHours"]);
            _userService = userService; 
        }

        public async Task<string> GenerateTokenAsync(User user)
        {
            return await Task.Run(() =>
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secretKey);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddHours(_expirationHours),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            });
        }

        public async Task<ClaimsPrincipal> ValidateTokenAsync(string token)
        {
            return await Task.Run(() =>
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secretKey);

                try
                {
                    var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ClockSkew = TimeSpan.Zero
                    }, out _);

                    return principal;
                }
                catch
                {
                    return null;
                }
            });
        }
        public async Task<ReadUserDTO> GetUserInfoFromTokenAsync(ClaimsPrincipal principal)
        {
            if (principal == null) return null;

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return null;

            var userId = int.Parse(userIdClaim);

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return null;

            return new ReadUserDTO(
                Id: user.Id,
                Username: user.Username,
                Email: user.Email,
                Role: user.Role,
                CreatedAt: user.CreatedAt
            );
        }
    }
}