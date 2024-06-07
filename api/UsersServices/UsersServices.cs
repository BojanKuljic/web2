using AutoMapper;
using Common.Contracts;
using Common.DTOs.Rides;
using Common.DTOs.Users;
using Common.Enums;
using Common.Utils;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using System.Fabric;
using System.Security.Cryptography;
using System.Text;
using UsersServices.Database.Model;
using UsersServices.Database.Repository;
using StatefulService = Microsoft.ServiceFabric.Services.Runtime.StatefulService;

namespace UsersServices
{
    internal sealed class UsersServices : StatefulService, IUsersServices
    {
        // Komunikacija sa servisom za vožnje
        private readonly IRidesServices RidesServices = ServiceProxy.Create<IRidesServices>(new Uri("fabric:/Fabric/RidesServices"));

        // Distribuirani, pouzdani recnik za cuvanje stanja na servisu
        internal IReliableDictionary<int, RideData> PouzdanoStanjeRecnikKorisnici { get; set; }

        // Auto-mapper za mapiranje DTO-a na modele i obrnuto
        private readonly IMapper _mapper;

        public UsersServices(StatefulServiceContext context, IMapper mapper) : base(context) => _mapper = mapper;

        // Metoda na korisnickom servisu za prijavu korisnika
        public async Task<UserData> LoginUser(LoginData data)
        {
            try
            {
                // Kreiranje hesirane lozinke
                using (SHA256 sha256 = SHA256.Create())
                {
                    byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data.Password));
                    data.Password = Convert.ToBase64String(hashBytes);
                }

                // Da li su podaci za prijavu tačni
                User user = await new UsersRepository().FilterUserAsync(x => x.Email == data.Email && x.Password == data.Password);
                return _mapper.Map<User, UserData>(user);
            }
            catch (Exception)
            {
                return new();
            }
        }

        // Metoda na servisu za registraciju korisnika
        public async Task<UserData> RegisterUser(RegisterData data)
        {
            try
            {
                // Pristup bazi podataka - tabela korisnika
                UsersRepository usersRepository = new();

                // Provera da li korisnik već postoji u bazi podataka sa istim emailom ili korisničkim imenom
                User postoji = await usersRepository.FilterUserAsync(x => x.Email == data.Email || x.Username == data.Username);

                // U bazi je već registrovan korisnik sa emailom ili korisničkim imenom
                if (postoji != null && postoji.Id != 0)
                    return new();
                else
                {
                    // Korisnik nije registrovan, potrebno je prvo sačuvati sliku na servisu, pa dodati korisnika u bazu podataka
                    string putanjaSlike = await ImageAssetManager.Upload(data.ProfileImage);

                    // Slika nije mogla biti otpremljena na servis
                    if (putanjaSlike == string.Empty)
                        return new();
                    else
                        data.ProfileImage = putanjaSlike;

                    // Hesiranje lozinke pre upisa u bazu podataka
                    using (SHA256 sha256 = SHA256.Create())
                    {
                        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data.Password));
                        data.Password = Convert.ToBase64String(hashBytes);
                    }

                    // Otpremljena slika na servis, dodavanje korisnika u bazu podataka
                    User novi = _mapper.Map<RegisterData, User>(data);

                    // Samo vozači imaju potrebnu verifikaciju
                    if (data.Role != UserRole.Driver)
                        novi.AccountVerificationStatus = StatusOfAccountVerification.Approved;

                    // Kreiranje novog korisnika
                    novi = await usersRepository.AddUserAsync(novi);

                    // Da li je kreiranje korisnika uspešno, ako jeste vraćamo podatke o novokreiranom korisniku
                    if (novi.Id != 0)
                        return _mapper.Map<User, UserData>(novi);
                    else
                        return new();
                }
            }
            catch (Exception)
            {
                return new();
            }
        }

        // Metoda za upotrebu Google naloga prilikom prijave/registracije korisnika
        public async Task<UserData> Google(RegisterData data)
        {
            try
            {
                UsersRepository usersRepository = new();

                // Ako je korisnik već registrovan, vršimo prijavu
                User postoji = await usersRepository.GetUserByEmailAsync(data.Email);

                // Ako je korisnik registrovan, vršimo prijavu korisnika
                if (postoji.Id != 0)
                    return _mapper.Map<User, UserData>(postoji);

                // Ako korisnik nije registrovan, vršimo registraciju i preuzimanje profilne fotografije sa Google servera
                data.ProfileImage = await ImageAssetManager.GoogleAccountImage(data.ProfileImage);

                // Nije uspelo preuzimanje fotografije
                if (data.ProfileImage == string.Empty)
                    return new();

                // Čuvanje fotografije na servisu
                data.ProfileImage = await ImageAssetManager.Upload(data.ProfileImage);

                // Nije uspelo otpremanje fotografije
                if (data.ProfileImage == string.Empty)
                    return new();

                // Fotografija je uspešno preuzeta, kreiranje novog korisnika
                User novi = _mapper.Map<RegisterData, User>(data);

                // Postavljanje vrednosti kolone Google naloga na true
                novi.IsGoogleAccount = true;

                // Samo vozači imaju potrebnu verifikaciju
                novi.AccountVerificationStatus = StatusOfAccountVerification.Approved;

                // Upis u bazu podataka
                novi = await usersRepository.AddUserAsync(novi);

                // Da li je kreiranje korisnika uspešno, ako jeste vraćamo podatke o novokreiranom korisniku
                if (novi.Id != 0)
                    return _mapper.Map<User, UserData>(novi);
                else
                    return new();
            }
            catch
            {
                return new();
            }
        }

        // Metoda za čitanje korisnika po primarnom ključu iz baze podataka
        public async Task<UserData> GetUserById(int id)
        {
            // Da li je validan ID
            if (id <= 0)
                return new();

            try
            {
                // Da li je korisnik registrovan sa traženim ID-om
                User user = await new UsersRepository().GetUserByIdAsync(id);

                // Ako je korisnik registrovan, preuzimamo sliku sa servera
                if (user.Id != 0)
                {
                    // Preuzimanje slike sa servisa
                    string slika = ImageAssetManager.Download(user.ProfileImage);

                    // Slika više nije na servisu
                    if (slika == string.Empty)
                        return new();

                    // Postavljanje preuzete slike sa servisa
                    user.ProfileImage = slika;

                    return _mapper.Map<User, UserData>(user);
                }
                else
                    return new();
            }
            catch
            {
                return new();
            }
        }

        // Metoda za ažuriranje korisničkih podataka po ID-ju korisnika
        public async Task<bool> UpdateUserById(int id, UserUpdateData data)
        {
            if (id <= 0 || data == null)
                return false;

            try
            {
                UsersRepository usersRepository = new();

                // Da li postoji korisnik u bazi podataka
                User korisnik = await usersRepository.GetUserByIdAsync(id);

                // Ako ne postoji, ne vršimo ažuriranje
                if (korisnik.Id == 0)
                    return false;

                // Ako je promenjeno korisničko ime, proveravamo da li je novo korisničko ime već zauzeto od strane drugog korisnika
                if (data.Username != korisnik.Username && ((await usersRepository.FilterUserAsync(x => x.Id != id && x.Username == data.Username)).Id != 0))
                    return false;

                // Analogna provera i za email
                if (data.Email != korisnik.Email && (await usersRepository.FilterUserAsync(x => x.Id != id && x.Email == data.Email)).Id != 0)
                    return false;

                // Proveravamo da li je korisnik promenio profilnu fotografiju
                if (data.ProfileImage != string.Empty)
                {
                    // Otpremanje fotografije
                    string putanja = await ImageAssetManager.Upload(data.ProfileImage);

                    // Ako otpremanje nije uspelo, prekidamo ažuriranje korisničkih podataka
                    if (putanja == string.Empty)
                        return false;

                    // Ažuriranje putanje profilne slike
                    korisnik.ProfileImage = putanja;
                }

                // Ako je promenjena šifra, potrebno ju je hesirati
                if (data.Password != string.Empty)
                {
                    // Hesiranje šifre pre upisa u bazu podataka
                    using (SHA256 sha256 = SHA256.Create())
                    {
                        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(data.Password));
                        korisnik.Password = Convert.ToBase64String(hashBytes);
                    }
                }

                // Ažuriranje korisničkih podataka
                korisnik.Username = data.Username;
                korisnik.Email = data.Email;
                korisnik.Address = data.Address;
                korisnik.FullName = data.FullName;
                korisnik.DateOfBirth = data.DateOfBirth;

                // Ažuriranje korisnika u bazi podataka
                return (await usersRepository.UpdateUserAsync(korisnik)).Id != 0;
            }
            catch
            {
                return false;
            }
        }

        // Metoda za ažuriranje statusa verifikacije vozača (Odobren, Odbijen, Na Čekanju)
        public async Task<bool> UpdateUserVerificationStatusById(int id, bool verificationStatus)
        {
            // Da li je validan ID
            if (id <= 0)
                return new();

            try
            {
                UsersRepository usersRepository = new();

                // Provera da li korisnik postoji u bazi podataka i da li je vozač, i
                // da li je njegov status verifikacije i dalje na čekanju
                User user = await usersRepository.FilterUserAsync(x => x.Id == id && x.Role == UserRole.Driver && x.AccountVerificationStatus == StatusOfAccountVerification.Pending);

                // Ako takav korisnik ne postoji, prekidamo promenu statusa
                if (user.Id == 0)
                    return false;

                // Ažuriranje statusa verifikacije
                user.AccountVerificationStatus = verificationStatus ? StatusOfAccountVerification.Approved : StatusOfAccountVerification.Denied;

                // Ažuriranje podataka u bazi podataka
                return (await usersRepository.UpdateUserAsync(user)).Id != 0;
            }
            catch
            {
                return false;
            }
        }

        // Metoda za blokiranje i deblokiranje vozača
        public async Task<bool> UpdateUserBlockStatusById(int id, bool blockStatus)
        {
            // Da li je validan ID
            if (id <= 0)
                return new();

            try
            {
                UsersRepository usersRepository = new();

                // Provera da li korisnik postoji u bazi podataka i da li je vozač, i
                // da li je njegov status blokiranja različit od onoga što treba da se postavi
                User user = await usersRepository.FilterUserAsync(x => x.Id == id && x.Role == UserRole.Driver && x.IsBlocked != blockStatus);

                // Ako takav korisnik ne postoji, prekidamo promenu statusa blokiranja
                if (user.Id == 0)
                    return false;

                // Ažuriranje statusa blokiranja
                user.IsBlocked = blockStatus;

                // Ažuriranje podataka u bazi podataka
                return (await usersRepository.UpdateUserAsync(user)).Id != 0;
            }
            catch
            {
                return false;
            }
        }

        // Metoda za čitanje svih vozača iz baze podataka
        public async Task<List<UserData>> GetDrivers()
        {
            try
            {
                List<UserData> drivers = _mapper.Map<List<User>, List<UserData>>(await new UsersRepository().FilterUsersAsync(x => x.Role == UserRole.Driver));

                // Preuzimanje fotografije sa servera za svakog vozača
                foreach (UserData driver in drivers)
                {
                    driver.ProfileImage = ImageAssetManager.Download(driver.ProfileImage);

                    // Proračun rejtinga vozača
                    driver.RatingScore = await RidesServices.GetDriverMetaScore(driver.Id);
                }

                return drivers;
            }
            catch
            {
                return new List<UserData>();
            }
        }

        // Metoda za dodavanje korisnika u pouzdani recnik i cuvanje stanja
        public async Task<bool> AddUserIntoWaitStateOnUsersService(RideData data)
        {
            try
            {
                // Cuvanje prethodnog ID-ja korisnika
                int userId = data.UserId;

                // Ako se dodaje vozač, potrebno je azurirati i stanje korisnika u recniku, 
                // jer stanje voznje prelazi u stanje u toku i proracunato je vreme putovanja
                if (data.DriverId != 0)
                {
                    // Prvo azuriranje korisnika koji ceka da se voznja prihvati
                    bool successfulUpdate = await UpdateUserInWaitStateOnUsersService(data);

                    // Zatim dodavanje vozača u stanje čekanja
                    if (successfulUpdate)
                    {
                        data.UserId = data.DriverId ?? 0;
                        return await AddIntoStateReliableDictionary(data);
                    }
                    else
                        return false;
                }
                else
                {
                    // Vraćanje sačuvanog ID-ja
                    data.UserId = userId;

                    // Dodavanje korisnika
                    return await AddIntoStateReliableDictionary(data);
                }
            }
            catch
            {
                return false;
            }
        }

        // Metoda za proveru postojanja korisnika u pouzdanom recniku
        public async Task<RideData> CheckWaitStateOnUsersService(int userId)
        {
            try
            {
                // Provera da li se korisnik već nalazi u recniku
                return await CheckStateReliableDictionary(userId);
            }
            catch
            {
                return new RideData { Id = 0 };
            }
        }

        // Metoda za kreiranje listener servisa Service Fabric
        protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners() => this.CreateServiceRemotingReplicaListeners();

        // Task koji se izvršava periodično
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            // Inicijalizacija pouzdanog recnika
            PouzdanoStanjeRecnikKorisnici = await StateManager.GetOrAddAsync<IReliableDictionary<int, RideData>>("PouzdanoStanjeRecnikKorisnici");

            while (true)
            {
                List<RideData> completedRides = new List<RideData>();

                using (var tx = StateManager.CreateTransaction())
                {
                    var enumerable = await PouzdanoStanjeRecnikKorisnici.CreateEnumerableAsync(tx);
                    var enumerator = enumerable.GetAsyncEnumerator();

                    while (await enumerator.MoveNextAsync(cancellationToken))
                    {
                        var current = enumerator.Current;
                        var value = current.Value;

                        // Logovanje trenutnog statusa vožnje
                        ServiceEventSource.Current.ServiceMessage(Context, "Obrada vožnje za korisnika {0}, status: {1}, vreme čekanja: {2}, vreme putovanja: {3}",
                                                                  current.Key, value.RideStatus, value.WaitingTime, value.TravelTime ?? 0);

                        // Procesuiramo samo vožnje koje nisu završene
                        if (value.RideStatus == StatusOfRide.InProgress)
                        {
                            if (value.WaitingTime > 0)
                            {
                                value.WaitingTime -= 1;
                                Thread.Sleep(500);
                            }
                            else if (value.TravelTime > 0)
                            {
                                value.TravelTime -= 1;
                                Thread.Sleep(500);
                            }
                        }

                        // Ako je vožnja završena, postavljamo njen status na Završena i uklanjamo je iz recnika
                        if (value.WaitingTime == 0 && value.TravelTime == 0)
                        {
                            value.RideStatus = StatusOfRide.Done;

                            // ID korisnika je ključ u recniku
                            value.UserId = current.Key;

                            completedRides.Add(value);
                        }

                        // Ažuriramo podatke o vožnji u pouzdanom recniku
                        await PouzdanoStanjeRecnikKorisnici.SetAsync(tx, current.Key, value);
                    }

                    await tx.CommitAsync();
                }

                //await PouzdanoStanjeRecnikKorisnici.ClearAsync();
                foreach (var ride in completedRides)
                {
                    // Uklanjamo završene vožnje i ažuriramo baze podataka
                    await DeleteUserFromWaitStateOnUsersService(ride.UserId);
                    await RidesServices.UpdateRide(ride);
                }

                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(1), cancellationToken);
            }
        }

        #region METODE ZA RAD SA POUZDANIM DISTRIBUIRANIM RECNIKOM 
        // Metoda za dodavanje korisnika u pouzdani recnik i cuvanje stanja
        public async Task<bool> AddIntoStateReliableDictionary(RideData data)
        {
            try
            {
                using (var tx = StateManager.CreateTransaction())
                {
                    var result = await PouzdanoStanjeRecnikKorisnici.TryAddAsync(tx, data.UserId, data);
                    await tx.CommitAsync();
                    return result;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        // Metoda za proveru postojanja korisnika u pouzdani recniku
        public async Task<RideData> CheckStateReliableDictionary(int userId)
        {
            try
            {
                using (var tx = StateManager.CreateTransaction())
                {
                    var result = await PouzdanoStanjeRecnikKorisnici.TryGetValueAsync(tx, userId);
                    return result.HasValue ? result.Value : new RideData { Id = 0 };
                }
            }
            catch (Exception)
            {
                return new RideData { Id = 0 };
            }
        }

        // Metoda za azuriranje korisnika u pouzdanom recniku
        public async Task<bool> UpdateUserInWaitStateOnUsersService(RideData data)
        {
            try
            {
                using (var tx = StateManager.CreateTransaction())
                {
                    var oldData = await PouzdanoStanjeRecnikKorisnici.TryGetValueAsync(tx, data.UserId);
                    var result = await PouzdanoStanjeRecnikKorisnici.TryUpdateAsync(tx, data.UserId, data, oldData.Value);
                    await tx.CommitAsync();
                    return result;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        // Metoda za brisanje korisnika iz pouzdanog recnika
        public async Task<bool> DeleteUserFromWaitStateOnUsersService(int userId)
        {
            try
            {
                using (var tx = StateManager.CreateTransaction())
                {
                    // Provera da li ključ postoji pre pokušaja uklanjanja
                    var result = await PouzdanoStanjeRecnikKorisnici.TryGetValueAsync(tx, userId);
                    if (result.HasValue)
                    {
                        var removeResult = await PouzdanoStanjeRecnikKorisnici.TryRemoveAsync(tx, userId);
                        await tx.CommitAsync();
                        ServiceEventSource.Current.ServiceMessage(Context, "Uklonjen korisnik {0} iz pouzdanog recnika", userId);
                        return removeResult.HasValue;
                    }
                    else
                    {
                        ServiceEventSource.Current.ServiceMessage(Context, "ID korisnika {0} nije pronađen u pouzdanom recniku", userId);
                        return false;
                    }
                }
            }
            catch (FabricNotPrimaryException ex)
            {
                ServiceEventSource.Current.ServiceMessage(Context, "FabricNotPrimaryException: {0}", ex.Message);
                throw;
            }
            catch (FabricTransientException ex)
            {
                ServiceEventSource.Current.ServiceMessage(Context, "FabricTransientException: {0}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                ServiceEventSource.Current.ServiceMessage(Context, "Izuzetak u DeleteUserFromWaitStateOnUsersService: {0}", ex.Message);
                throw;
            }
        }
        #endregion
    }
}

