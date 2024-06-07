using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmailsServices.Database.Model
{
    // Model za entitet Email
    public class Email
    {
        // Primarni ključ entiteta Email
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        // Email primaoca
        [Required]
        [StringLength(50)]
        [EmailAddress]
        public string Receipent { get; set; } = string.Empty;

        // Poruka emaila
        [Required]
        [StringLength(255)]
        public string Message { get; set; } = string.Empty;

        // Status slanja emaila
        [Required]
        [DefaultValue(false)]
        public bool Sent { get; set; } = false;

        // Konstruktor za inicijalizaciju Id-a
        public Email() => Id = 0;
    }
}
