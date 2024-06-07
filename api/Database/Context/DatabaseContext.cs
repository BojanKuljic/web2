using Common.Utils;
using EmailsServices.Database.Model;
using Microsoft.EntityFrameworkCore;

namespace EmailsServices.Database.Context
{
    // Kontekst baze podataka za pristup tabeli Emails
    public class DatabaseContext : DbContext
    {
        // Tabela Emails u bazi podataka
        public DbSet<Email> Emails { get; set; } = default!;

        // Prazan konstruktor
        public DatabaseContext() { }

        // Konfiguracija opcija konteksta baze podataka
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Provera da li su opcije konfigurisane
            if (!optionsBuilder.IsConfigured)
            {
                // Dobavljanje konfiguracionih opcija za vezu sa bazom iz konfiguracionog fajla
                Dictionary<string, string> configuration = new ConfigurationManager().GetConfigSection("ConnectionStrings");

                // Provera da li postoji konfiguracija za povezivanje sa bazom
                if (configuration.TryGetValue("EmailsSqlConnection", out string? value))
                {
                    // Parsiranje URI-a za MySQL konekciju
                    Uri uri = new(value);
                    string mysql = $"Server={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Uid={uri.UserInfo.Split(':')[0]};Pwd={Uri.UnescapeDataString(uri.UserInfo.Split(':')[1])};";

                    // Konfigurisanje opcija za MySQL bazu podataka
                    optionsBuilder.UseMySql(mysql, ServerVersion.AutoDetect(mysql));
                }
                else
                {
                    throw new Exception("Configuration file doesn't exist at the local fabric cluster!");
                }
            }
        }

        // Konfiguracija modela baze podataka
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Postavljanje kolacija i skupa karaktera
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci").HasCharSet("utf8mb4");
            DefineMappings(modelBuilder);
        }

        // Definisanje mapiranja entiteta
        protected virtual void DefineMappings(ModelBuilder modelBuilder) { }

        // Asinhrono čuvanje promena u bazi podataka
        public async Task<int> SaveChangesAsync()
        {
            return await base.SaveChangesAsync();
        }
    }
}
