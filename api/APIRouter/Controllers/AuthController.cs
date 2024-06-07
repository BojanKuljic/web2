using Common.Contracts;
using Common.DTOs.Users;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace APIRouter.Controllers
{
    // Ova klasa predstavlja API kontroler za autentifikaciju korisnika.
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Kreira proxy za komunikaciju sa UsersServices servisom
        private readonly IUsersServices UsersServices = ServiceProxy.Create<IUsersServices>(new Uri("fabric:/Fabric/UsersServices"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        // HTTP POST metod za prijavu korisnika
        [HttpPost("prijava")]
        public async Task<IActionResult> Login(LoginData data)
        {
            // Proverava da li je model validan
            if (ModelState.IsValid)
            {
                try
                {
                    // Poziva LoginUser metod iz UsersServices servisa
                    UserData user = await UsersServices.LoginUser(data);

                    // Proverava da li korisnik postoji
                    if (user == null || user.Id == 0)
                        return NotFound("User with provided email doesn't exist!");
                    else
                    {
                        // Generiše JWT token za korisnika
                        string token = JwtHelper.Token(user.Id, user.Role);
                        // Vraća token ako je generisan uspešno, inače vraća BadRequest
                        return token != string.Empty ? Ok(token) : BadRequest();
                    }
                }
                catch
                {
                    // Vraća status 500 u slučaju greške na serveru
                    return StatusCode(500);
                }
            }
            else
            {
                // Vraća BadRequest ako je model nevalidan
                return BadRequest("Invalid request has been made!");
            }
        }

        // HTTP POST metod za registraciju korisnika
        [HttpPost("registracija")]
        public async Task<IActionResult> Register(RegisterData data)
        {
            // Proverava da li je model validan
            if (ModelState.IsValid)
            {
                try
                {
                    // Poziva RegisterUser metod iz UsersServices servisa
                    UserData user = await UsersServices.RegisterUser(data);

                    // Proverava da li korisnik već postoji
                    if (user == null || user.Id == 0)
                        return NotFound("User with provided email already exists!");
                    else
                    {
                        // Generiše JWT token za korisnika
                        string token = JwtHelper.Token(user.Id, user.Role);
                        // Vraća token ako je generisan uspešno, inače vraća BadRequest
                        return token != string.Empty ? Ok(token) : BadRequest();
                    }
                }
                catch
                {
                    // Vraća status 500 u slučaju greške na serveru
                    return StatusCode(500);
                }
            }
            else
            {
                // Vraća BadRequest ako je model nevalidan
                return BadRequest("Invalid request has been made!");
            }
        }

        // HTTP POST metod za prijavu putem Google naloga
        [HttpPost("google")]
        public async Task<IActionResult> Google(RegisterData data)
        {
            // Proverava da li je model validan
            if (ModelState.IsValid)
            {
                try
                {
                    // Poziva Google metod iz UsersServices servisa
                    UserData user = await UsersServices.Google(data);

                    // Proverava da li korisnik već postoji
                    if (user == null || user.Id == 0)
                        return NotFound("User with provided email already exists!");
                    else
                    {
                        // Generiše JWT token za korisnika
                        string token = JwtHelper.Token(user.Id, user.Role);
                        // Vraća token ako je generisan uspešno, inače vraća BadRequest
                        return token != string.Empty ? Ok(token) : BadRequest();
                    }
                }
                catch
                {
                    // Vraća status 500 u slučaju greške na serveru
                    return StatusCode(500);
                }
            }
            else
            {
                // Vraća BadRequest ako je model nevalidan
                return BadRequest("Invalid request has been made!");
            }
        }
    }
}
