using AutoMapper.Configuration.Annotations;
using ServiceLayer.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer;
using Business_Layer.Enums;

namespace ServiceLayer.Mapper
{
    public static class Mapper
    {
        public static ReadUserDTO ToReadUserDTO(User user)
        {
            return new ReadUserDTO(user.Id, user.Username, user.Email, user.Role, user.CreatedAt);
        }
        public static User ToUser(SignUpRequestDTO signUpRequestDTO)
        {
            return new User
            {
                Username = signUpRequestDTO.Username,
                Email = signUpRequestDTO.Email,
                Password = signUpRequestDTO.Password,
                Role = (Role)signUpRequestDTO.Role
            };
        }
    }
}
