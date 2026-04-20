using BusinessLayer;
using DataLayer;
using Microsoft.EntityFrameworkCore;

namespace TestingLayer
{
    public abstract class TestBase
    {
        protected KirilixDbContext GetDbContext(string databaseName)
        {
            var options = new DbContextOptionsBuilder<KirilixDbContext>()
                .UseInMemoryDatabase(databaseName: databaseName)
                .Options;

            return new KirilixDbContext(options);
        }
    }
}
