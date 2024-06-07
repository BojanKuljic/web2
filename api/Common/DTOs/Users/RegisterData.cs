using Common.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Common.DTOs.Users
{
    // DTO (Data Transfer Object) koji predstavlja podatke za registraciju korisnika
    public class RegisterData
    {
        // Korisničko ime (obavezno polje, minimalna dužina 1)
        [Required(ErrorMessage = "Username is required.")]
        [MinLength(1, ErrorMessage = "Username must have at least 1 character.")]
        public string Username { get; set; } = string.Empty;

        // Email adresa (obavezno polje, validacija formata email adrese)
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        // Šifra korisnika (obavezno polje, minimalna dužina 6)
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must have at least 6 characters.")]
        public string Password { get; set; } = string.Empty;

        // Puno ime korisnika (obavezno polje, minimalna dužina 1)
        [Required(ErrorMessage = "Full name is required.")]
        [MinLength(1, ErrorMessage = "Full name must have at least 1 character.")]
        public string FullName { get; set; } = string.Empty;

        // Datum rođenja korisnika (obavezno polje)
        [Required(ErrorMessage = "Date of birth is required.")]
        public DateTime DateOfBirth { get; set; }

        // Adresa korisnika (obavezno polje, minimalna dužina 1)
        [Required(ErrorMessage = "Address is required.")]
        [MinLength(1, ErrorMessage = "Address must have at least 1 character.")]
        public string Address { get; set; } = string.Empty;

        // Korisnička uloga (obavezno polje, podrazumevana vrednost je UserRole.User)
        [Required(ErrorMessage = "Role is required.")]
        [DefaultValue(UserRole.User)]
        public UserRole Role { get; set; }

        // Putanja do slike profila korisnika (obavezno polje)
        [Required(ErrorMessage = "Profile image is required.")]
        public string ProfileImage { get; set; } = string.Empty;
    }
}
