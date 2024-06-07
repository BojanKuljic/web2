using EmailsServices.Database.Context; // Koristi se za pristup kontekstu baze podataka
using EmailsServices.Database.Model; // Koristi se za pristup modelu Email
using Microsoft.EntityFrameworkCore; // Biblioteka za rad sa Entity Framework Core

namespace EmailsServices.Database.Repository
{
    // Repozitorijum za rad sa email-ovima
    public class EmailsRepository
    {
        // Prazan konstruktor
        public EmailsRepository() { }

        // Metoda za ubacivanje novog email-a u bazu podataka
        public async Task<Email> InsertEmailAsync(Email email)
        {
            // Provera da li je email objekat null
            if (email == null)
                return new Email(); // Vraća novi prazan Email objekat

            using var context = new DatabaseContext(); // Instancira kontekst baze podataka
            var added = await context.Emails.AddAsync(email); // Dodaje novi email u bazu
            await context.SaveChangesAsync(); // Čuva promene u bazi
            return added.Entity; // Vraća dodat email objekat
        }

        // Metoda za dobavljanje prvog neposlanog email-a iz baze podataka
        public async Task<Email> GetUnsentEmailsAsync()
        {
            using var context = new DatabaseContext(); // Instancira kontekst baze podataka
            // Vraća prvi neposlan email ili novi prazan Email objekat
            return await context.Emails.AsNoTracking().FirstOrDefaultAsync(e => e.Sent == false) ?? new Email();
        }

        // Metoda za ažuriranje statusa poslatosti email-a u bazi podataka
        public async Task<bool> UpdateEmailStatusAsync(int id, bool sent)
        {
            using var context = new DatabaseContext(); // Instancira kontekst baze podataka
            var email = await context.Emails.FindAsync(id); // Pronalazi email po ID-ju

            if (email != null)
            {
                email.Sent = sent; // Ažurira status email-a
                await context.SaveChangesAsync(); // Čuva promene u bazi
                return true; // Vraća true ako je ažuriranje uspelo
            }

            return false; // Vraća false ako email nije pronađen
        }
    }
}
