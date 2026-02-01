using Business_Layer;
using DataLayer;
using Microsoft.EntityFrameworkCore;
using ServiceLayer;

namespace WebAPI;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        builder.Services.AddDbContext<KirilixDbContext>(options =>
            options.UseSqlite(connectionString));

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
        builder.Services.AddScoped<UserContext>();
        builder.Services.AddScoped<OTPCodeContext>();

        builder.Services.AddScoped<UserService>();
        builder.Services.AddScoped<OTPCodeService>();
        builder.Services.AddScoped<EmailService>();

        builder.Services.AddControllers();

        builder.Services.AddControllers();

        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.UseCors();

        app.MapControllers();

        app.Run();
    }
}
