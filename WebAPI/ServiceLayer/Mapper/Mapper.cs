using ServiceLayer.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.Enums;
using BusinessLayer;

namespace ServiceLayer.Mapper
{
    public static class Mapper
    {
        public static ReadUserDTO UserToReadUserDTO(User user)
        {
            return new ReadUserDTO(user.Id, user.Username, user.Email, user.Role, user.CreatedAt);
        }
        public static User SignUpRequestToUser(SignUpRequestDTO signUpRequestDTO)
        {
            return new User
            {
                Username = signUpRequestDTO.Username,
                Email = signUpRequestDTO.Email,
                Password = signUpRequestDTO.Password,
                Role = (Role)signUpRequestDTO.Role
            };
        }
        public static User UpdateUserDTOToUser(UpdateUserDTO user)
        {
            return new User
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = (Role)user.Role,
            };
        }
    }
}
