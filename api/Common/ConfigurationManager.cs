using Microsoft.Extensions.Configuration;

namespace Common.Utils
{
    // Klasa ConfigurationManager za učitavanje konfiguracionih vrednosti
    public class ConfigurationManager
    {
        // Privatna promenljiva koja čuva konfiguraciju
        private readonly IConfiguration _configuration;

        // Konstruktor koji inicijalizuje konfiguraciju čitajući iz appsettings.json fajla
        public ConfigurationManager()
        {
            _configuration = new ConfigurationBuilder()
                .AddJsonFile("C:/appsettings.json", optional: false, reloadOnChange: true)
                .Build();
        }

        // Metoda koja vraća sekciju konfiguracije kao rečnik (Dictionary)
        public Dictionary<string, string> GetConfigSection(string section_name)
        {
            try
            {
                // Dobija sekciju konfiguracije
                IConfigurationSection section = _configuration.GetSection(section_name);

                // Inicijalizuje prazan rečnik za čuvanje atributa
                Dictionary<string, string> attributes = new Dictionary<string, string>();

                // Prolazi kroz svako dete (podsekciju) i dodaje ključeve i vrednosti u rečnik
                foreach (IConfigurationSection child in section.GetChildren())
                {
                    if (child.Value != null)
                    {
                        attributes.Add(child.Key, child.Value);
                    }
                }

                // Vraća popunjen rečnik
                return attributes;
            }
            catch (Exception)
            {
                // U slučaju greške vraća prazan rečnik
                return [];
            }
        }
    }
}
