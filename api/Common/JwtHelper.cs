using Common.Enums;
using Common.Utils;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public static class JwtHelper
{
    // Učitava konfiguraciju za JWT iz ConfigurationManager klase
    private static readonly Dictionary<string, string> configuration = new ConfigurationManager().GetConfigSection("Jwt");

    // Metoda koja generiše JWT token
    public static string Token(int user_id, UserRole role)
    {
        try
        {
            // Proverava da li konfiguracija sadrži potrebne vrednosti
            if (configuration.TryGetValue("Key", out string? _key) &&
                configuration.TryGetValue("Issuer", out string? issuer) &&
                configuration.TryGetValue("Audience", out string? audience) &&
                configuration.TryGetValue("ExpirationTimeInMinutes", out string? expiration))
            {
                JwtSecurityTokenHandler tokenHandler = new();
                byte[] key = Encoding.ASCII.GetBytes(_key);

                // Postavlja opis JWT tokena
                SecurityTokenDescriptor tokenDescriptor = new()
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new("id", user_id.ToString()),
                        new("user_role", role.ToString()),
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(int.Parse(expiration)),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                    Issuer = issuer,
                    Audience = audience
                };

                // Kreira token i vraća ga kao string
                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            else
            {
                throw new Exception("Configuration file doesn't exist at the local fabric cluster!");
            }
        }
        catch (Exception)
        {
            return string.Empty;
        }
    }

    // Metoda koja iz JWT tokena izdvaja vrednost određenog claim-a
    public static string GetClaimValueFromToken(string? token, string claimName)
    {
        try
        {
            // Proverava da li konfiguracija sadrži potrebne vrednosti
            if (configuration.TryGetValue("Key", out string? _key) &&
                configuration.TryGetValue("Issuer", out string? issuer) &&
                configuration.TryGetValue("Audience", out string? audience))
            {
                byte[] key = Encoding.ASCII.GetBytes(_key);
                TokenValidationParameters validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // Onemogućava clock skew radi striktne validacije isteka tokena
                };

                JwtSecurityTokenHandler tokenHandler = new();
                ClaimsPrincipal principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                // Pronalazi i vraća vrednost traženog claim-a
                Claim? claim = principal.FindFirst(claimName);
                return claim?.Value ?? string.Empty;
            }
            else
            {
                throw new Exception("Configuration file doesn't exist at the local fabric cluster!");
            }
        }
        catch (Exception)
        {
            return string.Empty;
        }
    }
}
