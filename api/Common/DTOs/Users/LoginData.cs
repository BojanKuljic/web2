using System.ComponentModel.DataAnnotations;

namespace Common.DTOs.Users
{
    // DTO (Data Transfer Object) koji predstavlja podatke za prijavljivanje korisnika
    public class LoginData
    {
        // Email korisnika (obavezno polje)
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; } = string.Empty;

        // Šifra korisnika (obavezno polje)
        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }
}
