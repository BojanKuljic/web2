using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace APIRouter
{
    /// <summary>
    /// FabricRuntime kreira instancu ove klase za svaki tip servisa.
    /// </summary>
    internal sealed class APIRouter : StatelessService
    {
        // Konstruktor za APIRouter klasu, poziva bazni konstruktor sa prosleđenim kontekstom
        public APIRouter(StatelessServiceContext context) : base(context) { }

        // Prepisuje CreateServiceInstanceListeners metodu da bi kreirao slušaoce za instance servisa
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            // Vraća kolekciju slušalaca servisa
            return
            [
                // Kreira novog slušaoca servisa koristeći KestrelCommunicationListener
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        // Ispisuje poruku o pokretanju Kestrela na datoj URL adresi
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        // Kreira builder za web aplikaciju
                        var builder = WebApplication.CreateBuilder();

                        // Dodaje ServiceContext kao singleton servis
                        builder.Services.AddSingleton(serviceContext);
                        // Konfiguriše Kestrel kao web server
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory()) // Postavlja root direktorijum za sadržaj
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None) // Integracija sa Service Fabric
                                    .UseUrls(url); // Postavlja URL na kojem će slušati

                        // Dodaje podršku za CORS (Cross-Origin Resource Sharing)
                        builder.Services.AddCors();
                        // Dodaje podršku za kontrolere
                        builder.Services.AddControllers();
                        // Dodaje podršku za memorijsku keširanje
                        builder.Services.AddDistributedMemoryCache();
                        // Dodaje podršku za sesije
                        builder.Services.AddSession(options =>
                        {
                            options.IdleTimeout = TimeSpan.FromMinutes(120); // Postavlja timeout za sesije
                            options.Cookie.HttpOnly = true; // Postavlja kolačić kao HTTP only
                            options.Cookie.IsEssential = true; // Obeležava kolačić kao esencijalan
                        });

                        // Gradi aplikaciju
                        var app = builder.Build();
                        // Dodaje podršku za sesije
                        app.UseSession();
                        // Konfiguriše CORS opcije
                        app.UseCors(options =>
                        {
                            options.AllowAnyOrigin() // Dozvoljava bilo koji origin
                                   .AllowAnyMethod() // Dozvoljava bilo koju HTTP metodu
                                   .AllowAnyHeader(); // Dozvoljava bilo koji HTTP header
                        });

                        // Mapira rute za kontrolere
                        app.MapControllers();

                        // Vraća izgrađenu aplikaciju
                        return app;

                    }))
            ];
        }
    }
}
