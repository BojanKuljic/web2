using Common.DTOs.Rides;
using Common.Enums;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Contracts
{
    // Definiše interfejs IRidesServices koji nasleđuje IService
    public interface IRidesServices : IService
    {
        // Metoda za dobijanje podataka o vožnji na osnovu njenog ID-ja
        Task<RideData> GetRideById(int id);

        // Metoda za dobijanje meta ocene vozača na osnovu njegovog ID-ja
        Task<float> GetDriverMetaScore(int driver_id);

        // Metoda za dobijanje liste vožnji na osnovu ID-ja i uloge korisnika
        Task<List<RideData>> GetRides(int id, UserRole role);

        // Metoda za dobijanje liste dostupnih vožnji
        Task<List<RideData>> GetAvailableRides();

        // Metoda za kreiranje nove vožnje
        Task<RideData> CreateNewRide(RideData data);

        // Metoda za ažuriranje postojećih podataka o vožnji
        Task<RideData> UpdateRide(RideData data);

        // Metoda za prihvatanje postojeće vožnje od strane vozača
        Task<RideData> AcceptExistingRide(int ride_id, int driver_id);
    }
}
