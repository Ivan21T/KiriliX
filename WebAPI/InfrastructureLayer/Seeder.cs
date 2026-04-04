using DataLayer.Repositories;
using DataLayer;
using BusinessLayer;
using BusinessLayer.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace InfrastructureLayer
{
    public class DbSeeder : IDbSeeder
    {
        private readonly IServiceProvider _serviceProvider;

        public DbSeeder(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task SeedDataAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<KirilixDbContext>();

            if (!await context.Users.AnyAsync(u => u.Role == Role.Admin))
            {
                var admin = new User
                {
                    Username = "IvanTT",
                    Email = "it.kirilix@gmail.com",
                    Role = Role.Admin,
                    Password= BCrypt.Net.BCrypt.HashPassword("admin123"), 
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(admin);
                await context.SaveChangesAsync();
            }
        }
    }
}
