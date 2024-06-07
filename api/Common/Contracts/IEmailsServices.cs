using Microsoft.ServiceFabric.Services.Remoting;

namespace Common.Contracts
{
    // Definisanje interfejsa za Email Servis koji nasleđuje IService
    public interface IEmailsServices : IService
    {
        // Asinhrona metoda za dodavanje emaila sa zadatom porukom
        Task AddEmail(string email, string message);
    }
}
