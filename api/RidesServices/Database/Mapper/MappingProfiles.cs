using AutoMapper;  // Koristimo AutoMapper biblioteku za mapiranje između entiteta i DTO-ova
using Common.DTOs.Rides;  // Koristimo prostor imena Common.DTOs.Rides koji sadrži DTO-ove za vožnje
using RidesServices.Database.Model;  // Koristimo prostor imena RidesServices.Database.Model koji sadrži modele baze podataka

namespace RidesServices.Database.Mapper
{
    // Klasa koja definiše profile mapiranja između entiteta i DTO-ova
    public class MappingProfiles : Profile
    {
        // Konstruktor klase MappingProfiles
        public MappingProfiles()
        {
            CreateMap<Ride, RideData>();  // Mapiranje entiteta Ride na DTO RideData
            CreateMap<RideData, Ride>();  // Mapiranje DTO RideData na entitet Ride
        }
    }
}
