using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer
{
    interface IDb<T,K>
    {
        Task CreateAsync(T item);
        Task<T> ReadAsync(K id, bool useNavigationProperties = false, bool isReadOnly = false);
        Task<List<T>> ReadAllAsync(bool useNavigationProperties = false, bool isReadOnly = false);
        Task UpdateAsync(T entity, bool useNavigationProperties = false);
        Task DeleteAsync(K id);

    }
}
