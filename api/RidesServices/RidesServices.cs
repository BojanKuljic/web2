using AutoMapper;  // Koristimo AutoMapper za mapiranje između različitih tipova podataka
using Common.Contracts;  // Koristimo Common.Contracts za pristup ugovorenim interfejsima
using Common.DTOs.Rides;  // Koristimo Common.DTOs.Rides za pristup DTO-ovima vezanim za vožnje
using Common.DTOs.Users;  // Koristimo Common.DTOs.Users za pristup DTO-ovima vezanim za korisnike
using Common.Enums;  // Koristimo Common.Enums za pristup enumeracijama
using Microsoft.ServiceFabric.Services.Client;  // Koristimo Microsoft.ServiceFabric.Services.Client za kreiranje klijenta servisa
using Microsoft.ServiceFabric.Services.Communication.Client;  // Koristimo Microsoft.ServiceFabric.Services.Communication.Client za komunikaciju sa servisima
using Microsoft.ServiceFabric.Services.Communication.Runtime;  // Koristimo Microsoft.ServiceFabric.Services.Communication.Runtime za komunikaciju između servisa
using Microsoft.ServiceFabric.Services.Remoting.Client;  // Koristimo Microsoft.ServiceFabric.Services.Remoting.Client za pristup udaljenim servisima
using Microsoft.ServiceFabric.Services.Remoting.Runtime;  // Koristimo Microsoft.ServiceFabric.Services.Remoting.Runtime za udaljeno izvršavanje
using Microsoft.ServiceFabric.Services.Runtime;  // Koristimo Microsoft.ServiceFabric.Services.Runtime za pravljenje servisa
using RideServices.Database.Repository;  // Koristimo RideServices.Database.Repository za pristup repozitorijumu vožnji
using RidesServices.Database.Model;  // Koristimo RidesServices.Database.Model za pristup modelima podataka vožnji
using System.Fabric;  // Koristimo System.Fabric za pristup Service Fabric API-ju

namespace RidesServices
{
    // Glavna klasa koja implementira interfejs IRidesServices i predstavlja servis za upravljanje vožnjama
    internal sealed class RidesServices : StatelessService, IRidesServices
    {
        // Automatski maper za mapiranje između različitih tipova podataka
        private readonly IMapper _mapper;

        // Servis za korisnike
        private readonly IUsersServices UsersServices = ServiceProxy.Create<IUsersServices>(new Uri("fabric:/Fabric/UsersServices"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        // Konstruktor koji prima kontekst servisa i automatski maper
        public RidesServices(StatelessServiceContext context, IMapper mapper) : base(context) => _mapper = mapper;

        // Metoda za dobijanje vožnje po ID-u
        public async Task<RideData> GetRideById(int id)
        {
            // Provera da li je ID vožnje validan
            if (id <= 0)
                return new() { Id = 0 };

            try
            {
                // Dobavljanje vožnje iz baze podataka i mapiranje na DTO
                return _mapper.Map<Ride, RideData>(await new RidesRepository().GetRideByIdAsync(id));
            }
            catch
            {
                return new() { Id = 0 };
            }
        }

        // Metoda za izračunavanje rejtinga vozača
        public async Task<float> GetDriverMetaScore(int driver_id)
        {
            // Provera da li je ID vozača validan
            if (driver_id <= 0)
                return 0.0f;

            try
            {
                // Dobavljanje vožnji koje je vozač završio i računanje prosečne ocene
                List<Ride> rides = await new RidesRepository().FilterRidesAsync(d => d.DriverId == driver_id && d.RideStatus == StatusOfRide.Done && d.ReviewScore > 0);
                if (rides.Count == 0)
                    return 0.0f;
                return (float)Math.Round((float)rides.Sum(x => x.ReviewScore) / (float)rides.Count, 2);
            }
            catch
            {
                return 0.0f;
            }
        }

        // Metoda za dobijanje vožnji
        public async Task<List<RideData>> GetRides(int id, UserRole role)
        {
            try
            {
                // Dobavljanje vožnji u zavisnosti od uloge korisnika
                RidesRepository ridesRepository = new();
                if (role == UserRole.Admin)
                    return _mapper.Map<List<Ride>, List<RideData>>(await ridesRepository.GetAllRidesAsync());
                else if (role == UserRole.User)
                    return _mapper.Map<List<Ride>, List<RideData>>(await ridesRepository.FilterRidesAsync(r => r.UserId == id));
                else if (role == UserRole.Driver)
                    return _mapper.Map<List<Ride>, List<RideData>>(await ridesRepository.FilterRidesAsync(r => r.DriverId == id && r.RideStatus == StatusOfRide.Done));
                else
                    return [];
            }
            catch
            {
                return [];
            }
        }

        // Metoda za dobijanje dostupnih vožnji
        public async Task<List<RideData>> GetAvailableRides()
        {
            try
            {
                // Dobavljanje svih dostupnih vožnji
                return _mapper.Map<List<Ride>, List<RideData>>(await new RidesRepository().FilterRidesAsync(r => r.RideStatus == StatusOfRide.Created));
            }
            catch
            {
                return [];
            }
        }

        // Metoda za kreiranje nove vožnje
        public async Task<RideData> CreateNewRide(RideData data)
        {
            try
            {
                // Kreiranje nove vožnje i dodavanje u bazu podataka
                RidesRepository rides = new();
                Ride ride = _mapper.Map<RideData, Ride>(data);
                ride.RideStatus = StatusOfRide.Created;
                ride = await rides.AddRideAsync(ride);
                if (ride.Id != 0)
                    return _mapper.Map<Ride, RideData>(ride);
                else
                    return new() { Id = 0 };
            }
            catch
            {
                return new() { Id = 0 };
            }
        }

        // Metoda za ažuriranje vožnje
        public async Task<RideData> UpdateRide(RideData data)
        {
            try
            {
                // Provera da li je ID vožnje validan
                if (data.Id == 0)
                    return new() { Id = 0 };

                // Ažuriranje vožnje u bazi podataka
                RidesRepository rides = new();
                Ride ride = await rides.GetRideByIdAsync(data.Id);
                if (ride.Id == 0)
                    return new() { Id = 0 };

                // Čuvanje originalnih vrednosti stranih ključeva i postavljanje novih vrednosti
                if (data.DriverId == data.UserId)
                {
                    data.DriverId = ride.DriverId;
                    data.UserId = ride.UserId;
                }

                // Ako su vremena vožnje nula, zadrži originalne vrednosti
                if (data.WaitingTime == 0)
                    data.WaitingTime = ride.WaitingTime;

                if (data.TravelTime == 0)
                    data.TravelTime = ride.TravelTime;

                // Ažuriranje vožnje u bazi podataka
                ride = await rides.UpdateRideAsync(_mapper.Map<RideData, Ride>(data));
                if (ride.Id != 0)
                    return _mapper.Map<Ride, RideData>(ride);
                else
                    return new() { Id = 0 };
            }
            catch
            {
                return new() { Id = 0 };
            }
        }

        // Metoda za prihvatanje postojeće vožnje od strane vozača
        public async Task<RideData> AcceptExistingRide(int ride_id, int driver_id)
        {
            try
            {
                // Provera validnosti ID-ova vožnje i vozača
                if (ride_id == 0 || driver_id == 0)
                    return new() { Id = 0 };

                // Pronalaženje vožnje u bazi podataka
                RidesRepository rides = new();
                Ride ride = await rides.GetRideByIdAsync(ride_id);

                // Provera da li vožnja još uvek postoji i da li je njen status "Created" (čeka na prihvatanje)
                if (ride.Id == 0)
                    return new() { Id = 0 };

                // Provera da li je vozač dostupan za vožnje (nije blokiran, nije na čekanju, i sl.)
                UserData driver = await UsersServices.GetUserById(driver_id);
                if (driver.Id == 0 || driver.IsOnWait || driver.IsBlocked || driver.AccountVerificationStatus != StatusOfAccountVerification.Approved)
                    return new() { Id = 0 };

                // Postavljanje statusa vožnje na "InProgress", dodavanje vozača i generisanje vremena putovanja
                ride.RideStatus = StatusOfRide.InProgress;
                ride.DriverId = driver_id;
                ride.TravelTime = new Random().Next(10, 60); // Vreme putovanja između 10 i 60 sekundi

                // Ažuriranje vožnje u bazi podataka
                ride = await rides.UpdateRideAsync(ride);
                if (ride.Id != 0)
                    return _mapper.Map<Ride, RideData>(ride);
                else
                    return new() { Id = 0 };
            }
            catch
            {
                return new() { Id = 0 };
            }
        }

        // Metoda za kreiranje slušača servisa
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        // Metoda koja se pokreće pri pokretanju servisa
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }
    }
}
