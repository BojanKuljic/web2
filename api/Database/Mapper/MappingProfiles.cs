using AutoMapper;

namespace EmailsServices.Database.Mapper
{
    public class MappingProfiles : Profile
    {
        // Klasa u kojoj se koriste i kreiraju veze i mape između DTO i modela baze podataka
        public MappingProfiles()
        {
            // Nema DTO pa ni potreba za mapiranjem
        }
    }
}
