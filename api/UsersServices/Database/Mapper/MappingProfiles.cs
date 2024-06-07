using AutoMapper;  // Koristimo AutoMapper za mapiranje između DTO (Data Transfer Object) i modela
using Common.DTOs.Users;  // Koristimo Common.DTOs.Users za pristup DTO-ovima korisnika
using UsersServices.Database.Model;  // Koristimo UsersServices.Database.Model za pristup modelima podataka korisnika

namespace UsersServices.Database.Mapper
{
    // Klasa koja definiše profile za mapiranje između DTO-ova i modela
    public class MappingProfiles : Profile
    {
        // Konstruktor klase MappingProfiles
        public MappingProfiles()
        {
            CreateMap<User, UserData>(); // Mapiranje iz modela User na DTO UserData   
            CreateMap<RegisterData, User>(); // Mapiranje iz DTO RegisterData na model User
        }
    }
}
