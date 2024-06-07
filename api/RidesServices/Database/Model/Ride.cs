using Common.Enums;  // Koristimo prostor imena Common.Enums koji sadrži enumeracije
using System.ComponentModel;  // Koristimo prostor imena System.ComponentModel za podršku za atributima
using System.ComponentModel.DataAnnotations;  // Koristimo prostor imena System.ComponentModel.DataAnnotations za definisanje validacija
using System.ComponentModel.DataAnnotations.Schema;  // Koristimo prostor imena System.ComponentModel.DataAnnotations.Schema za rad sa atributima baze podataka

namespace RidesServices.Database.Model
{
    // Klasa koja predstavlja model podataka za vožnju
    public class Ride
    {
        [Key]  // Označava svojstvo kao ključ
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]  // Definiše da se vrednost generiše automatski
        public int Id { get; set; }  // Identifikator vožnje

        [Required]  // Definiše da je svojstvo obavezno
        public int UserId { get; set; }  // Identifikator korisnika koji je rezervisao vožnju

        public int? DriverId { get; set; }  // Identifikator vozača koji je dodeljen vožnji

        [Required]  // Definiše da je svojstvo obavezno
        [StringLength(255)]  // Definiše maksimalnu dužinu teksta
        public string StartAddress { get; set; } = string.Empty;  // Adresa polaska, podrazumevana vrednost je prazan string

        [Required]  // Definiše da je svojstvo obavezno
        [StringLength(255)]  // Definiše maksimalnu dužinu teksta
        public string EndAddress { get; set; } = string.Empty;  // Adresa odredišta, podrazumevana vrednost je prazan string

        [Required]  // Definiše da je svojstvo obavezno
        [Column(TypeName = "decimal(18, 2)")]  // Definiše tip kolone u bazi podataka
        [DefaultValue(0.0)]  // Podrazumevana vrednost je 0.0
        public decimal Price { get; set; }  // Cena vožnje

        [Required]  // Definiše da je svojstvo obavezno
        [DefaultValue(0)]  // Podrazumevana vrednost je 0
        public int WaitingTime { get; set; }  // Vreme čekanja vožnje

        public int? TravelTime { get; set; }  // Vreme putovanja, može biti null

        [Required]  // Definiše da je svojstvo obavezno
        public StatusOfRide RideStatus { get; set; }  // Status vožnje

        [Required]  // Definiše da je svojstvo obavezno
        [DefaultValue(0)]  // Podrazumevana vrednost je 0
        public int ReviewScore { get; set; }  // Ocenjivanje vožnje
    }
}
