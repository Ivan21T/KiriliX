using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Business_Layer;
namespace DataLayer
{
    public class KirilixDbContext:DbContext
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<OTPCode> OTPCodes { get; set; }
        public DbSet<News> News { get; set; }
        public KirilixDbContext(): base()
        {
        }
        public KirilixDbContext(DbContextOptions<KirilixDbContext> options) : base(options)
        {
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("Data Source=Kirilix.db");
            }
            base.OnConfiguring(optionsBuilder);
        }
    }
}
