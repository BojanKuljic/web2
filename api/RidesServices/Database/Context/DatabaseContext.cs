using Common.Utils;  // Koristimo prostor imena Common.Utils
using Microsoft.EntityFrameworkCore;  // Koristimo prostor imena Microsoft.EntityFrameworkCore
using RidesServices.Database.Model;  // Koristimo prostor imena RidesServices.Database.Model

namespace RidesServices.Database.Context
{
    // Definišemo klasu DatabaseContext koja nasleđuje DbContext
    public class DatabaseContext : DbContext
    {
        // Definišemo svojstvo Rides koje predstavlja tabelu u bazi podataka za entitet Ride
        public DbSet<Ride> Rides { get; set; } = default!;

        // Konstruktor bez parametara
        public DatabaseContext() { }  // Prazan konstruktor klase DatabaseContext

        // Override-ujemo metodu OnConfiguring za konfiguraciju opcija konteksta baze podataka
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Proveravamo da li su opcije već konfigurisane
            if (!optionsBuilder.IsConfigured)  // Ako opcije nisu već konfigurisane
            {
                // Učitavamo sekciju konfiguracije za konekcije sa bazom podataka
                Dictionary<string, string> configuration = new ConfigurationManager().GetConfigSection("ConnectionStrings");

                if (configuration.TryGetValue("RidesSqlConnection", out string? value))  // Proveravamo da li postoji konekcija sa bazom podataka u konfiguraciji
                {
                    Uri uri = new(value);  // Parsiramo URI iz konfiguracije
                    string mysql = $"Server={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Uid={uri.UserInfo.Split(':')[0]};Pwd={Uri.UnescapeDataString(uri.UserInfo.Split(':')[1])};";  // Formiramo string za MySQL konekciju
                    optionsBuilder.UseMySql(mysql, ServerVersion.AutoDetect(mysql));  // Konfigurišemo konekciju na MySQL bazu podataka
                }
                else
                {
                    throw new Exception("Konfiguracioni fajl ne postoji na lokalnom klasteru!");  // Bacamo izuzetak ako konfiguracioni fajl ne postoji
                }
            }
        }

        // Override-ujemo metodu OnModelCreating za konfiguraciju modela podataka
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci").HasCharSet("utf8mb4");  // Postavljamo kolaciju i skup karaktera za bazu podataka
            DefineMappings(modelBuilder);  // Pozivamo metodu za definisanje mapiranja
        }

        // Metoda za definisanje mapiranja modela podataka na bazu podataka
        protected virtual void DefineMappings(ModelBuilder modelBuilder)
        {
            // Mapiramo enumeracije vezane za vožnje na kolone u bazi podataka
            modelBuilder.Entity<Ride>().Property(u => u.RideStatus).HasConversion<string>();
        }

        // Metoda za asinhrono čuvanje promena u bazi podataka
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();  // Asinhrono čuvamo promene i vraćamo rezultat
        }
    }
}
