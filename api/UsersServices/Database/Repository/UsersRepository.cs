using Microsoft.EntityFrameworkCore;  // Koristimo Microsoft.EntityFrameworkCore za rad sa Entity Framework Core
using System.Linq.Expressions;  // Koristimo System.Linq.Expressions za definisanje izraza
using UsersServices.Database.Context;  // Koristimo UsersServices.Database.Context za pristup kontekstu baze podataka
using UsersServices.Database.Model;  // Koristimo UsersServices.Database.Model za pristup modelima podataka korisnika

namespace UsersServices.Database.Repository
{
    // Klasa koja predstavlja repozitorijum za rad sa korisnicima
    public class UsersRepository
    {
        // Konstruktor klase
        public UsersRepository() { }

        // Metoda za dobavljanje korisnika po ID-u
        public async Task<User> GetUserByIdAsync(int id)
        {
            // Koristi se using blok kako bi se osiguralo da se resursi oslobode nakon zavrsetka operacije
            using var context = new DatabaseContext();
            // Pronalazi korisnika po ID-u ili vraca novog korisnika ako ne postoji
            return await context.Users.FindAsync(id) ?? new User();
        }

        // Metoda za dobavljanje korisnika po emailu
        public async Task<User> GetUserByEmailAsync(string email)
        {
            // Provera da li je email prazan ili null
            if (string.IsNullOrWhiteSpace(email))
                return new User();

            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Pronalazi korisnika po emailu ili vraca novog korisnika ako ne postoji
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email) ?? new User();
        }

        // Metoda za dobavljanje svih korisnika
        public async Task<List<User>> GetAllUsersAsync()
        {
            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Vraca sve korisnike iz baze, koristi AsNoTracking kako bi se izbeglo pracenje promena
            return await context.Users.AsNoTracking().ToListAsync();
        }

        // Metoda za dodavanje novog korisnika
        public async Task<User> AddUserAsync(User user)
        {
            // Provera da li je korisnik null
            if (user == null)
                return new User();

            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Dodavanje korisnika u bazu
            var added = context.Users.Add(user);

            // Cuvanje promena u bazi
            if (await context.SaveChangesAsync() > 0)
                return added.Entity;

            return new User();
        }

        // Metoda za azuriranje korisnika
        public async Task<User> UpdateUserAsync(User user)
        {
            // Provera da li je korisnik null
            if (user == null)
                return new User();

            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Postavljanje stanja korisnika na Modified kako bi se označila promena
            context.Entry(user).State = EntityState.Modified;

            // Cuvanje promena u bazi
            if (await context.SaveChangesAsync() > 0)
                return user;
            else
                return new User();
        }

        // Metoda za brisanje korisnika po ID-u
        public async Task<bool> DeleteUserAsync(int id)
        {
            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Pronalazi korisnika po ID-u
            var user = await context.Users.FindAsync(id);
            if (user != null)
            {
                // Uklanja korisnika iz DbSet-a
                context.Users.Remove(user);
                // Cuvanje promena u bazi
                return await context.SaveChangesAsync() > 0;
            }
            else
                return false;
        }

        // Metoda za filtriranje korisnika na osnovu izraza
        public async Task<User> FilterUserAsync(Expression<Func<User, bool>> filter)
        {
            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Pronalazi korisnika koji zadovoljava zadati izraz ili vraca novog korisnika ako ne postoji
            return await context.Users.AsNoTracking().FirstOrDefaultAsync(filter) ?? new User();
        }

        // Metoda za filtriranje svih korisnika na osnovu izraza
        public async Task<List<User>> FilterUsersAsync(Expression<Func<User, bool>> filter)
        {
            // Koristi se using blok za instanciranje DatabaseContext-a
            using var context = new DatabaseContext();
            // Pronalazi sve korisnike koji zadovoljavaju zadati izraz
            return await context.Users.AsNoTracking().Where(filter).ToListAsync();
        }
    }
}
