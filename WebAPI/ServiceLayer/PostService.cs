using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer;
using Business_Layer;
namespace ServiceLayer
{
    public class PostService
    {
        private readonly PostContext _postContext;
        public PostService(PostContext postContext)
        {
            _postContext = postContext;
        }
        public async Task CreatePostAsync(Post post)
        {
            await _postContext.CreateAsync(post);
        }

    }
}
