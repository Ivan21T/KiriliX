using InfrastructureLayer;
using Business_Layer;
using DataLayer;
using DataLayer.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ServiceLayer;
using System.Text;

namespace WebAPI;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<KirilixDbContext>(options =>
            options.UseSqlite(connectionString));

        var jwtSecretKey = builder.Configuration["Jwt:SecretKey"];

        var key = Encoding.ASCII.GetBytes(jwtSecretKey);

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };
        });

        // CORS - allow all
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        // Register services
        builder.Services.AddSingleton<IDbSeeder, DbSeeder>();

        builder.Services.AddScoped<UserContext>();
        builder.Services.AddScoped<OTPCodeContext>();
        builder.Services.AddScoped<PostContext>();
        builder.Services.AddScoped<CommentContext>();
        builder.Services.AddScoped<NewsContext>();

        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<OTPCodeService>();
        builder.Services.AddScoped<EmailService>();
        builder.Services.AddScoped<PostService>();
        builder.Services.AddScoped<CommentService>();
        builder.Services.AddScoped<NewsService>();
        builder.Services.AddScoped<JwtService>();
        builder.Services.AddScoped<AdminService>();

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var app = builder.Build();

        using (var scope = app.Services.CreateScope())
        {
            var seeder = scope.ServiceProvider.GetRequiredService<IDbSeeder>();
            await seeder.SeedDataAsync();
        }

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();
        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}