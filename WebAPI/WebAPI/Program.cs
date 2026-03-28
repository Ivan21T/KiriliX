using Business_Layer;
using DataLayer;
using Microsoft.EntityFrameworkCore;
using ServiceLayer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace WebAPI;

public class Program
{
    public static void Main(string[] args)
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

        builder.Services.AddControllers();
        builder.Services.AddOpenApi();

        var app = builder.Build();

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