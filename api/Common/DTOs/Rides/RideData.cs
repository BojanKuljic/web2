using Common.Enums;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Common.DTOs.Rides
{
    // DTO (Data Transfer Object) koji predstavlja podatke o vožnji
    public class RideData
    {
        // Identifikator vožnje
        public int Id { get; set; }

        // Identifikator korisnika koji je naručio vožnju
        [Required(ErrorMessage = "User ID is required.")]
        public int UserId { get; set; }

        // Identifikator vozača koji je prihvatio vožnju (može biti null ako vožnja nije prihvaćena)
        public int? DriverId { get; set; }

        // Adresa polaska vožnje
        [Required(ErrorMessage = "Start address is required.")]
        public string StartAddress { get; set; } = string.Empty;

        // Adresa odredišta vožnje
        [Required(ErrorMessage = "End address is required.")]
        public string EndAddress { get; set; } = string.Empty;

        // Cena vožnje
        [Required(ErrorMessage = "Price is required.")]
        public decimal Price { get; set; }

        // Vreme čekanja vožnje
        [Required(ErrorMessage = "Waiting time is required.")]
        public int WaitingTime { get; set; }

        // Vreme putovanja vožnje (može biti null ako vožnja još uvek nije završena)
        public int? TravelTime { get; set; }

        // Status vožnje
        public StatusOfRide RideStatus { get; set; }

        // Ocenjivanje vožnje (podrazumevana vrednost je 0)
        [DefaultValue(0)]
        public int ReviewScore { get; set; }

        // Konstruktor koji postavlja ID na 0 kao podrazumevanu vrednost
        public RideData() => Id = 0;
    }
}
