using Common.Utils;  // Koristimo Common.Utils za pristup korisnim metodama i funkcijama
using Microsoft.EntityFrameworkCore;  // Koristimo Microsoft.EntityFrameworkCore za rad sa Entity Framework Core
using UsersServices.Database.Model;  // Koristimo UsersServices.Database.Model za pristup modelima podataka korisnika

namespace UsersServices.Database.Context
{
    // Klasa koja predstavlja kontekst baze podataka za korisnike
    public class DatabaseContext : DbContext
    {
        // DbSet koji predstavlja tabelu korisnika u bazi podataka
        public DbSet<User> Users { get; set; } = default!;

        // Konstruktor bez parametara
        public DatabaseContext() { }

        // Metoda koja se poziva prilikom konfigurisanja opcija konteksta
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Osigurava da su opcije konfigurisane samo jednom
            if (!optionsBuilder.IsConfigured)
            {
                // Dobavljanje informacija o konekciji iz konfiguracionog fajla
                Dictionary<string, string> configuration = new ConfigurationManager().GetConfigSection("ConnectionStrings");

                // Provera da li postoji konekcioni string za korisnike
                if (configuration.TryGetValue("UsersSqlConnection", out string? value))
                {
                    // Parsiranje URI-ja za konekciju
                    Uri uri = new(value);
                    // Formiranje MySQL konekcione niske
                    string mysql = $"Server={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Uid={uri.UserInfo.Split(':')[0]};Pwd={Uri.UnescapeDataString(uri.UserInfo.Split(':')[1])};";
                    // Postavljanje opcija za korišćenje MySQL baze podataka
                    optionsBuilder.UseMySql(mysql, ServerVersion.AutoDetect(mysql));
                }
                else
                {
                    // Bacanje izuzetka ako konfiguracioni fajl ne postoji na lokalnom fabric klasteru
                    throw new Exception("Configuration file doesn't exist at the local fabric cluster!");
                }
            }
        }

        // Metoda koja se poziva prilikom kreiranja modela
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Postavljanje collation-a i charset-a na utf8mb4
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci").HasCharSet("utf8mb4");
            // Definisanje mapiranja za entitete
            DefineMappings(modelBuilder);
        }

        // Virtuelna metoda koja definiše mapiranje entiteta
        protected virtual void DefineMappings(ModelBuilder modelBuilder)
        {
            // Mapiranje enumeracija vezanih za korisnika na kolone u bazi podataka
            modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<string>();
            modelBuilder.Entity<User>().Property(u => u.AccountVerificationStatus).HasConversion<string>();
        }

        // Metoda za asinhrono čuvanje promena u bazi podataka
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }
    }
}
