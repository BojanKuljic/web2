using Common.Enums;  // Koristimo Common.Enums za pristup enumeracijama
using Microsoft.EntityFrameworkCore;  // Koristimo Microsoft.EntityFrameworkCore za rad sa Entity Framework Core
using System.ComponentModel;  // Koristimo System.ComponentModel za definisanje atributa
using System.ComponentModel.DataAnnotations;  // Koristimo System.ComponentModel.DataAnnotations za definisanje atributa validacije
using System.ComponentModel.DataAnnotations.Schema;  // Koristimo System.ComponentModel.DataAnnotations.Schema za definisanje atributa za mapiranje

namespace UsersServices.Database.Model
{
    // Klasa koja predstavlja model korisnika
    [Index(nameof(Username), IsUnique = true)]  // Definisanje indeksa za kolonu Username, čija je vrednost jedinstvena
    [Index(nameof(Email), IsUnique = true)]  // Definisanje indeksa za kolonu Email, čija je vrednost jedinstvena
    public class User
    {
        // Primarni ključ, automatski generisan
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Obavezno polje za korisničko ime, maksimalna dužina 255 karaktera
        [Required]
        [StringLength(255)]
        public string Username { get; set; } = string.Empty;

        // Obavezno polje za email adresu, maksimalna dužina 255 karaktera
        [Required]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        // Obavezno polje za lozinku, maksimalna dužina 255 karaktera
        [Required]
        [StringLength(255)]
        public string Password { get; set; } = string.Empty;

        // Obavezno polje za puno ime korisnika, maksimalna dužina 255 karaktera
        [Required]
        [StringLength(255)]
        public string FullName { get; set; } = string.Empty;

        // Obavezno polje za datum rođenja korisnika
        [Required]
        public DateTime DateOfBirth { get; set; }

        // Obavezno polje za adresu korisnika, maksimalna dužina 255 karaktera
        [Required]
        [StringLength(255)]
        public string Address { get; set; } = string.Empty;

        // Obavezno polje za ulogu korisnika
        [Required]
        public UserRole Role { get; set; }

        // Polje za putanju do slike profila korisnika, maksimalna dužina 255 karaktera
        [StringLength(255)]
        public string ProfileImage { get; set; } = string.Empty;

        // Polje za status verifikacije naloga, podrazumevana vrednost je "Pending"
        [Required]
        [DefaultValue(StatusOfAccountVerification.Pending)]
        public StatusOfAccountVerification AccountVerificationStatus { get; set; }

        // Polje koje označava da li je korisnički nalog blokiran, podrazumevana vrednost je "false"
        [Required]
        [DefaultValue(false)]
        public bool IsBlocked { get; set; }

        // Polje koje označava da li je korisnički nalog povezan sa Google nalogom, podrazumevana vrednost je "false"
        [Required]
        [DefaultValue(false)]
        public bool IsGoogleAccount { get; set; }

        // Konstruktor koji postavlja ID na 0
        public User() => Id = 0;
    }
}
