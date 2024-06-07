using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Diagnostics;
using UsersServices.Database.Mapper;

namespace UsersServices
{
    internal static class Program
    {
        /// <summary>
        /// This is the entry point of the service host process.
        /// </summary>
        private static void Main()
        {
            try
            {
                ServiceCollection serviceCollection = new();
                serviceCollection.AddAutoMapper(typeof(MappingProfiles));
                ServiceProvider provider = serviceCollection.BuildServiceProvider();

                ServiceRuntime.RegisterServiceAsync("UsersServicesType",
                    context => new UsersServices(context, provider.GetRequiredService<IMapper>())).GetAwaiter().GetResult();

                ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(UsersServices).Name);

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
