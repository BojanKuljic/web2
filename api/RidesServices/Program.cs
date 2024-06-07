using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Runtime;
using RidesServices.Database.Mapper;
using System.Diagnostics;

namespace RidesServices
{
    internal static class Program
    {
        private static void Main()
        {
            try
            {
                ServiceCollection serviceCollection = new();
                serviceCollection.AddAutoMapper(typeof(MappingProfiles));
                ServiceProvider provider = serviceCollection.BuildServiceProvider();

                ServiceRuntime.RegisterServiceAsync("RidesServicesType",
                    context => new RidesServices(context, provider.GetRequiredService<IMapper>())).GetAwaiter().GetResult();

                ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(RidesServices).Name);

                // Prevents this host process from terminating so services keep running.
                Thread.Sleep(Timeout.Infinite);
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
                throw;
            }
        }
    }
}
