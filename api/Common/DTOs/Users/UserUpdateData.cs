using System.ComponentModel.DataAnnotations;

namespace Common.DTOs.Users
{
    // DTO (Data Transfer Object) koji predstavlja podatke za ažuriranje korisnika
    public class UserUpdateData
    {
        // Korisničko ime (obavezno polje)
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = string.Empty;

        // Email adresa (obavezno polje)
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = string.Empty;

        // Nova šifra korisnika (nije obavezno polje)
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

        // Nova putanja do slike profila korisnika (nije obavezno polje)
        public string ProfileImage { get; set; } = string.Empty;
    }
}
