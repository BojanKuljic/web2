using Common.Contracts;
using Common.DTOs.Rides;
using Common.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace APIRouter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RidesController : ControllerBase
    {
        // Kreira instancu RidesServices koristeći ServiceProxy za komunikaciju sa Service Fabric servisom
        private readonly IRidesServices RidesServices = ServiceProxy.Create<IRidesServices>(new Uri("fabric:/Fabric/RidesServices"));

        // Kreira instancu UsersServices koristeći ServiceProxy za komunikaciju sa Service Fabric servisom
        private readonly IUsersServices UsersServices = ServiceProxy.Create<IUsersServices>(new Uri("fabric:/Fabric/UsersServices"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        // HTTP GET metod za dobavljanje vožnji
        [HttpGet("all/{id?}")]
        public async Task<IActionResult> GetRides(int? id)
        {
            try
            {
                // Dobavljanje role iz JWT tokena
                string jwt_rola = JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

                // Proverava da li je JWT rola admin
                if (jwt_rola == UserRole.Admin.ToString())
                {
                    // Ako je admin, dobavlja sve vožnje
                    return Ok(await RidesServices.GetRides(0, UserRole.Admin));
                }
                else
                {
                    // Ako nije admin, proverava da li se ID iz JWT poklapa sa zahtevanim ID-jem
                    if (!int.TryParse(JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "id"), out int jwt_id) || jwt_id != id)
                        return Unauthorized("You don't have permission to view data!");

                    // Dobavlja vožnje po korisniku (UserId se poklapa sa zahtevanim ID-jem)
                    if (jwt_rola == UserRole.User.ToString())
                        return Ok(await RidesServices.GetRides(jwt_id, UserRole.User)); // Vožnje za korisnika
                    else if (jwt_rola == UserRole.Driver.ToString())
                        return Ok(await RidesServices.GetRides(jwt_id, UserRole.Driver)); // Završene vožnje za vozača
                    else
                        return Unauthorized();
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // HTTP GET metod za dobavljanje dostupnih vožnji
        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRides()
        {
            try
            {
                // Dobavljanje role iz JWT tokena
                string jwt_rola = JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

                // Proverava da li je JWT rola vozač
                if (jwt_rola == UserRole.Driver.ToString())
                {
                    // Ako je vozač, dobavlja sve dostupne vožnje
                    return Ok(await RidesServices.GetAvailableRides());
                }
                else
                    return Unauthorized();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // HTTP POST metod za kreiranje nove vožnje
        [HttpPost("create")]
        public async Task<IActionResult> CreateRide(RideData data)
        {
            // Proverava da li su poslati validni podaci
            if (ModelState.IsValid == false)
                return BadRequest("Invalid data has been provided!");

            // Proverava da li vožnju kreira neko ko nije korisnik
            if (JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != UserRole.User.ToString())
                return Unauthorized("You don't have permission to create a ride");

            try
            {
                // Proverava da li korisnik već postoji u stanju čekanja
                if ((await UsersServices.CheckWaitStateOnUsersService(data.UserId)).UserId != 0)
                    return BadRequest();

                // Kreira novu vožnju
                RideData ride = await RidesServices.CreateNewRide(data);

                if (ride.Id == 0)
                    return BadRequest();
                else
                {
                    // Dodaje korisnika koji je kreirao vožnju u stanje čekanja radi čuvanja stanja
                    if (await UsersServices.AddUserIntoWaitStateOnUsersService(ride))
                        return Ok(ride); // Vožnja je dodata i stanje korisnika je sačuvano na servisu
                    else
                        return BadRequest();
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // HTTP PATCH metod za prihvatanje vožnje
        [HttpPatch("accept/{ride_id}/{driver_id}")]
        public async Task<IActionResult> AcceptRide(int ride_id, int driver_id)
        {
            // Proverava da li se prihvata vožnja za nevalidne podatke
            if (ride_id == 0 || driver_id == 0)
                return BadRequest();

            // Proverava da li vožnju prihvata neko ko nije vozač
            if (JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != UserRole.Driver.ToString())
                return Unauthorized("You don't have permission to accept a ride");

            try
            {
                // Prihvata novu vožnju - izmeniti status vožnje na u toku
                RideData ride = await RidesServices.AcceptExistingRide(ride_id, driver_id);

                // Proverava da li je vožnja uspešno prihvaćena
                if (ride.Id != 0)
                {
                    // Ako je vožnja prihvaćena dodaje vozača u stanje korisničkog servisa
                    if (await UsersServices.AddUserIntoWaitStateOnUsersService(ride))
                        return Ok(ride); // Vožnja je prihvaćena
                    else
                        return BadRequest("User can't be added into wait state.");
                }
                else
                    return BadRequest("Ride doesn't exist anymore.");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // HTTP GET metod za proveru da li je korisnik trenutno u vožnji
        [HttpGet("in-progress/{user_id}")]
        public async Task<IActionResult> IsUserAtRide(int user_id)
        {
            // Ako nije definisan korisnički ID, ne postoji provera statusa
            if (user_id == 0)
                return BadRequest("You didn't provide necessary data.");

            // Na čekanju može biti samo korisnik ili vozač
            string jwt_role = JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role");

            // Ako nije korisnik niti vozač, nema prava pristupa
            if (string.IsNullOrEmpty(jwt_role) || (jwt_role != UserRole.Driver.ToString() && jwt_role != UserRole.User.ToString()))
                return Unauthorized("You don't have permission to view data!");

            try
            {
                // Proverava u stanju korisničkog servisa da li je korisnik u vožnji
                RideData data = await UsersServices.CheckWaitStateOnUsersService(user_id);

                // Ako postoji aktivna vožnja, vraća podatke o vožnji
                if (data.Id != 0)
                    return Ok(data);
                else
                    return BadRequest("User is not at wait state.");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // HTTP PATCH metod za ocenjivanje vožnje
        [HttpPatch("review/{ride_id}/{review}")]
        public async Task<IActionResult> WriteReview(int ride_id, int review)
        {
            // Proverava da li se ocenjuje vožnja za nevalidne podatke
            if (ride_id == 0 || review == 0 || (review < 1 && review > 5))
                return BadRequest();

            try
            {
                // Ako nije korisnik, nema prava pristupa ocenjivanju vožnje
                if (JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != UserRole.User.ToString())
                    return Unauthorized("You don't have permission to view data!");

                // Proverava da li vožnja i dalje postoji
                RideData voznja = await RidesServices.GetRideById(ride_id);

                if (voznja.Id == 0)
                    return NotFound("Ride doesn't exist anymore.");

                // Proverava da li vožnju ocenjuje korisnik koji je naručio vožnju
                if (!int.TryParse(JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "id"), out int jwt_id) || jwt_id != voznja.UserId)
                    return Unauthorized("You don't have permission to view data!");

                // Prosleđuje se ocena vožnje
                voznja.ReviewScore = review;

                // Ocenjivanje vožnje
                voznja = await RidesServices.UpdateRide(voznja);

                // Proverava da li je ocenjivanje vožnje uspešno
                if (voznja.Id != 0)
                    return Ok();
                else
                    return BadRequest();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}
