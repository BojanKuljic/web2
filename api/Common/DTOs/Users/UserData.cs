using Common.Enums;
using System.ComponentModel.DataAnnotations;

namespace Common.DTOs.Users
{
    // DTO (Data Transfer Object) koji predstavlja podatke o korisniku
    public class UserData
    {
        // Identifikator korisnika (obavezno polje)
        [Required(ErrorMessage = "User ID is required.")]
        public int Id { get; set; }

        // Korisničko ime (obavezno polje)
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = string.Empty;

        // Email adresa (obavezno polje)
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = string.Empty;

        // Šifra korisnika (obavezno polje)
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;

        // Puno ime korisnika (obavezno polje)
        [Required(ErrorMessage = "Full name is required.")]
        public string FullName { get; set; } = string.Empty;

        // Datum rođenja korisnika (obavezno polje)
        [Required(ErrorMessage = "Date of birth is required.")]
        public DateTime DateOfBirth { get; set; }

        // Adresa korisnika (obavezno polje)
        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; } = string.Empty;

        // Korisnička uloga (obavezno polje)
        [Required(ErrorMessage = "Role is required.")]
        public UserRole Role { get; set; }

        // Putanja do slike profila korisnika (obavezno polje)
        [Required(ErrorMessage = "Profile image is required.")]
        public string ProfileImage { get; set; } = string.Empty;

        // Status verifikacije naloga (obavezno polje)
        [Required(ErrorMessage = "Account verification status is required.")]
        public StatusOfAccountVerification AccountVerificationStatus { get; set; }

        // Da li je korisnik blokiran (obavezno polje)
        [Required(ErrorMessage = "Blocked status is required.")]
        public bool IsBlocked { get; set; }

        // Da li je korisnik u stanju čekanja (obavezno polje)
        [Required(ErrorMessage = "Wait status is required.")]
        public bool IsOnWait { get; set; }

        // Da li je korisnik koristio Google nalog za prijavljivanje (obavezno polje)
        [Required(ErrorMessage = "Google account status is required.")]
        public bool IsGoogleAccount { get; set; }

        // Ocjena korisnika (može biti null ako korisnik nema ocjenu)
        public float RatingScore { get; set; } = 0.0f;

        // Konstruktor koji postavlja ID korisnika na 0 kao podrazumevanu vrednost
        public UserData() => Id = 0;
    }
}
