using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Business_Layer;
using Microsoft.EntityFrameworkCore;
namespace DataLayer
{
    public class OTPCodeContext : IDb<OTPCode, int>
    {
        private readonly KirilixDbContext _context;
        public OTPCodeContext(KirilixDbContext context)
        {
            _context = context;
        }
        public async Task CreateAsync(OTPCode item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }
            await _context.OTPCodes.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var code = await _context.OTPCodes.FirstOrDefaultAsync(c => c.Id == id);
            if(code == null)
            {
                throw new Exception("OTP кодът не е намерен!");
            }
            _context.OTPCodes.Remove(code);
            await _context.SaveChangesAsync();
        }

        public async Task<List<OTPCode>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<OTPCode> query = _context.OTPCodes;
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            return await query.ToListAsync();
        }

        public async Task<OTPCode> ReadAsync(int id, bool useNavigationProperties = false, bool isReadOnly = false)
        {
            IQueryable<OTPCode> query = _context.OTPCodes;
            if (isReadOnly)
            {
                query = query.AsNoTrackingWithIdentityResolution();
            }
            OTPCode code = await query.FirstOrDefaultAsync(u => u.Id == id);
            if (code == null)
            {
                throw new Exception("Кодът не е намерен!");
            }
            return code;
        }

        public async Task UpdateAsync(OTPCode entity, bool useNavigationProperties = false)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            var existingCode = await _context.OTPCodes
                .FirstOrDefaultAsync(u => u.Id == entity.Id);

            if (existingCode == null)
            {
                throw new Exception("Кодът не е намерен!");
            }
            _context.Entry(existingCode).CurrentValues.SetValues(entity);

            await _context.SaveChangesAsync();
        }
    }
}
