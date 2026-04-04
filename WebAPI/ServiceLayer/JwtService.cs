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

        public JwtService(IConfiguration configuration)
        {
            _secretKey = configuration["Jwt:SecretKey"];
            _expirationHours = int.Parse(configuration["Jwt:ExpirationHours"]);
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
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Role, user.Role.ToString()),
                        new Claim("CreatedAt", user.CreatedAt.ToString("o"))
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
            return await Task.Run(() =>
            {
                if (principal == null) return null;

                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var username = principal.FindFirst(ClaimTypes.Name)?.Value;
                var email = principal.FindFirst(ClaimTypes.Email)?.Value;
                var roleStr = principal.FindFirst(ClaimTypes.Role)?.Value;
                var createdAtStr = principal.FindFirst("CreatedAt")?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(username) ||
                    string.IsNullOrEmpty(email) || string.IsNullOrEmpty(roleStr))
                    return null;

                if (!Enum.TryParse<Role>(roleStr, out var role))
                    return null;

                DateTime? createdAt = null;
                if (!string.IsNullOrEmpty(createdAtStr))
                {
                    createdAt = DateTime.Parse(createdAtStr, null, System.Globalization.DateTimeStyles.RoundtripKind);
                }

                return new ReadUserDTO(
                    Id: int.Parse(userId),
                    Username: username,
                    Email: email,
                    Role: role,
                    CreatedAt:(DateTime)createdAt
                );
            });
        }
    }
}