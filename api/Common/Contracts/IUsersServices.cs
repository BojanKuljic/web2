using Common.DTOs.Rides;
using Common.DTOs.Users;
using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Contracts
{
    // Definiše interfejs IUsersServices koji nasleđuje IService
    public interface IUsersServices : IService
    {
        // Metoda za prijavljivanje korisnika
        Task<UserData> LoginUser(LoginData data);

        // Metoda za registraciju korisnika
        Task<UserData> RegisterUser(RegisterData data);

        // Metoda za prijavljivanje korisnika preko Google naloga
        Task<UserData> Google(RegisterData data);

        // Metoda za dobijanje podataka o korisniku na osnovu ID-ja
        Task<UserData> GetUserById(int id);

        // Metoda za ažuriranje podataka o korisniku na osnovu ID-ja
        Task<bool> UpdateUserById(int id, UserUpdateData data);

        // Metoda za ažuriranje statusa verifikacije korisnika na osnovu ID-ja
        Task<bool> UpdateUserVerificationStatusById(int id, bool verificationStatus);

        // Metoda za ažuriranje statusa blokiranja korisnika na osnovu ID-ja
        Task<bool> UpdateUserBlockStatusById(int id, bool blockStatus);

        // Metoda za dobijanje liste vozača
        Task<List<UserData>> GetDrivers();

        // Metoda za dodavanje korisnika u stanje čekanja na korisničkom servisu
        Task<bool> AddUserIntoWaitStateOnUsersService(RideData data);

        // Metoda za proveru stanja čekanja korisnika na korisničkom servisu
        Task<RideData> CheckWaitStateOnUsersService(int user_id);
    }
}
