namespace Common.Enums
{
    // Enumeracija koja predstavlja status verifikacije naloga
    public enum StatusOfAccountVerification
    {
        Pending, // Nalog čeka na verifikaciju
        Approved, // Nalog je verifikovan
        Denied // Verifikacija naloga je odbijena
    }

    // Enumeracija koja predstavlja status vožnje
    public enum StatusOfRide
    {
        InProgress, // Vožnja je u toku
        Created, // Vožnja je kreirana
        Done // Vožnja je završena
    }

    // Enumeracija koja predstavlja ulogu korisnika
    public enum UserRole
    {
        Admin, // Administrator
        User, // Običan korisnik
        Driver // Vozač
    }
}
