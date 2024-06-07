using MimeDetective;

namespace Common.Utils
{
    // Klasa koja upravlja obradom slika
    public class ImageAssetManager
    {
        // Metoda za upload slike
        public static async Task<string> Upload(string image)
        {
            try
            {
                // Razdvajanje baznog64 dela slike
                string[] base64Parts = image.Split(',');
                if (base64Parts.Length != 2)
                    return string.Empty;

                // Ekstrahovanje baznog64 stringa i ekstenzije slike
                string base64String = base64Parts[1];
                string extension = base64Parts[0].Split(';')[0].Split('/')[1];
                byte[] imageBytes = Convert.FromBase64String(base64String);

                // Kreiranje direktorijuma za čuvanje slika ako ne postoji
                if (!Directory.Exists("C:/taxi/slike"))
                    Directory.CreateDirectory("C:/taxi/slike");

                // Generisanje relativne putanje za čuvanje slike
                string relativePath = Path.Combine("C:/taxi/slike", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString() + "." + extension);
                await File.WriteAllBytesAsync(relativePath, imageBytes);
                return relativePath;
            }
            catch
            {
                return string.Empty;
            }
        }

        // Metoda za preuzimanje slike
        public static string Download(string path)
        {
            try
            {
                // Dobijanje apsolutne putanje slike
                string absolutePath = Path.GetFullPath(path);

                // Provera da li slika postoji
                if (!File.Exists(absolutePath))
                    return string.Empty;

                // Čitanje bajtova slike i konverzija u bazni64 string
                byte[] bytes = File.ReadAllBytes(absolutePath);
                string base64String = Convert.ToBase64String(bytes);
                string extension = Path.GetExtension(absolutePath).Remove(0, 1);
                return $"data:image/{extension};base64,{base64String}";
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        // Metoda za obradu slike sa Google naloga
        public static async Task<string> GoogleAccountImage(string imageUrl)
        {
            try
            {
                // Klijent za preuzimanje slike sa URL-a
                using HttpClient httpClient = new();
                byte[] imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                string base64String = Convert.ToBase64String(imageBytes);

                // Inspektor za određivanje tipa slike
                ContentInspector inspector = new ContentInspectorBuilder() { Definitions = MimeDetective.Definitions.Default.All() }.Build();
                System.Collections.Immutable.ImmutableArray<MimeDetective.Engine.DefinitionMatch> results = inspector.Inspect(imageBytes);
                return $"data:image/{results.First().Definition.File.Extensions.First()};base64,{base64String}";
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
    }
}
