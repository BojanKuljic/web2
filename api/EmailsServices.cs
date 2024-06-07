using Common.Contracts; // Koristi se za ugovor IEmailsServices
using EmailsServices.Database.Model; // Koristi se za pristup modelu Email
using EmailsServices.Database.Repository; // Koristi se za pristup repozitorijumu EmailsRepository
using Microsoft.ServiceFabric.Services.Communication.Runtime; // Koristi se za komunikaciju sa Service Fabric
using Microsoft.ServiceFabric.Services.Remoting.Runtime; // Koristi se za servisno remoting sučelje
using Microsoft.ServiceFabric.Services.Runtime; // Koristi se za osnovne funkcionalnosti servisa
using SendGrid; // Koristi se za slanje email-a
using SendGrid.Helpers.Mail; // Koristi se za oblikovanje email-a
using System.Fabric; // Koristi se za pristup informacijama o servisu

namespace EmailsServices
{
    // Klasa koja implementira servis za slanje email-a
    internal sealed class EmailsServices : StatelessService, IEmailsServices
    {
        // Konstruktor
        public EmailsServices(StatelessServiceContext context) : base(context) { }

        // Metoda u Emails servisu za prijem poruka o statusu verifikacije naloga
        public async Task AddEmail(string email, string message)
        {
            try
            {
                // Dodavanje email-a u bazu podataka
                await new EmailsRepository().InsertEmailAsync(new Email() { Message = message, Receipent = email });
            }
            catch { }
        }

        // Kreira instance slušača servisne instance
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        // Asinhrono izvršava servis
        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                // Periodična provera da li je dostupan email za slanje
                Email email = await new EmailsRepository().GetUnsentEmailsAsync();

                // Pokušaj slanja email-a
                if (email.Id != 0 && await SendEmail(email.Message, email.Receipent, "Status verifikacije je promenjen"))
                    await new EmailsRepository().UpdateEmailStatusAsync(email.Id, true);

                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(15), cancellationToken);
            }
        }

        // Metoda za slanje elektronske pošte korišćenjem SendGrid API-ja
        public static async Task<bool> SendEmail(string message, string to, string subject)
        {
            // TODO: Promeni na drugi API ključ
            var apiKey = "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";
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("ebdldv3@gmail.com", "RCA Projekat");
            var toEmail = new EmailAddress(to, to.Split('@')[0]);
            var plainTextContent = message;
            var htmlContent = "<strong>" + message + "</strong>";
            var msg = MailHelper.CreateSingleEmail(from, toEmail, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
            return response.IsSuccessStatusCode;
        }
    }
}
