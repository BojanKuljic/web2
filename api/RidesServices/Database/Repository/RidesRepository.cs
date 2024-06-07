using Microsoft.EntityFrameworkCore;  // Koristimo Microsoft.EntityFrameworkCore za rad sa Entity Framework Core
using RidesServices.Database.Context;  // Koristimo prostor imena RidesServices.Database.Context za pristup kontekstu baze podataka
using RidesServices.Database.Model;  // Koristimo prostor imena RidesServices.Database.Model za pristup modelu Ride
using System.Linq.Expressions;  // Koristimo System.Linq.Expressions za rad sa lambda izrazima

namespace RideServices.Database.Repository
{
    // Klasa koja sadrži metode za rad sa podacima o vožnjama
    public class RidesRepository
    {
        // Konstruktor
        public RidesRepository() { }

        // Metoda za dobijanje vožnje po ID-u
        public async Task<Ride> GetRideByIdAsync(int id)
        {
            // Blok koji garantuje da će resursi biti oslobođeni nakon završetka operacije
            using var context = new DatabaseContext();
            // Pronalazi vožnju po ID-u ili vraća novu vožnju ako nije pronađena
            return await context.Rides.FindAsync(id) ?? new() { Id = 0 };
        }

        // Metoda za dobijanje svih vožnji
        public async Task<List<Ride>> GetAllRidesAsync()
        {
            // Blok koji instancira DatabaseContext
            using var context = new DatabaseContext();
            // Vraća sve vožnje iz baze podataka, koristeći AsNoTracking da izbegne praćenje promena
            return await context.Rides.AsNoTracking().ToListAsync();
        }

        // Metoda za dodavanje nove vožnje
        public async Task<Ride> AddRideAsync(Ride ride)
        {
            // Provera da li je vožnja null
            if (ride == null)
                return new() { Id = 0 };

            // Blok koji instancira DatabaseContext
            using var context = new DatabaseContext();
            // Dodaje vožnju u bazu podataka
            var added = context.Rides.Add(ride);

            // Čuva promene u bazi podataka
            if (await context.SaveChangesAsync() > 0)
                return added.Entity;

            return new() { Id = 0 };
        }

        // Metoda za ažuriranje vožnje
        public async Task<Ride> UpdateRideAsync(Ride ride)
        {
            // Provera da li je vožnja null
            if (ride == null)
                return new() { Id = 0 };

            // Blok koji instancira DatabaseContext
            using var context = new DatabaseContext();
            // Postavlja stanje vožnje na Modified kako bi označio promene
            context.Entry(ride).State = EntityState.Modified;

            // Čuva promene u bazi podataka
            if (await context.SaveChangesAsync() > 0)
                return ride;
            else
                return new() { Id = 0 };
        }

        // Metoda za brisanje vožnje po ID-u
        public async Task<bool> DeleteRideAsync(int id)
        {
            // Blok koji instancira DatabaseContext
            using var context = new DatabaseContext();
            // Pronalazi vožnju po ID-u
            var ride = await context.Rides.FindAsync(id);
            if (ride != null)
            {
                // Uklanja vožnju iz DbSet-a
                context.Rides.Remove(ride);
                // Čuva promene u bazi podataka
                return await context.SaveChangesAsync() > 0;
            }
            else
                return false;
        }

        // Metoda za filtriranje vožnji na osnovu predikata
        public async Task<Ride> FilterRideAsync(Expression<Func<Ride, bool>> filter)
        {
            // Blok koji instancira DatabaseContext
            using var context = new DatabaseContext();
            // Pronalazi vožnju koja odgovara predikatu ili vraća novu vožnju ako nije pronađena
            return await context.Rides.AsNoTracking().FirstOrDefaultAsync(filter) ?? new() { Id = 0 };
        }

        // Metoda za filtriranje svih vožnji na osnovu predikata
        public async Task<List<Ride>> FilterRidesAsync(Expression<Func<Ride, bool>> filter)
        {
            // Blok koji instancira DatabaseContext
            using var context = new DatabaseContext();
            // Pronalazi sve vožnje koje odgovaraju predikatu
            return await context.Rides.AsNoTracking().Where(filter).ToListAsync();
        }
    }
}
