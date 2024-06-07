using Common.Contracts;
using Common.DTOs.Users;
using Common.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;

namespace APIRouter.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // Kreira instancu UsersServices koristeći ServiceProxy za komunikaciju sa Service Fabric servisom
        private readonly IUsersServices UsersServices = ServiceProxy.Create<IUsersServices>(new Uri("fabric:/Fabric/UsersServices"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);

        // HTTP GET metoda za dobijanje korisnika po ID-ju
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            // Proverava da li je ID validan
            if (id <= 0)
                return BadRequest("Invalid request has been made!");

            // Proverava JWT token i upoređuje ID iz tokena sa prosleđenim ID-jem
            if (!int.TryParse(JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "id"), out int jwt_id) || jwt_id != id)
                return Unauthorized("You don't have permission to read user data!");

            try
            {
                // Poziva servis za dobijanje korisnika po ID-ju
                UserData korisnik = await UsersServices.GetUserById(id);

                // Proverava da li je korisnik pronađen
                if (korisnik.Id == 0)
                    return NotFound("User profile couldn't be found!");
                else
                    return Ok(korisnik);
            }
            catch
            {
                // Vraća statusni kod 500 u slučaju greške
                return StatusCode(500);
            }
        }

        // HTTP PATCH metoda za azuriranje korisnickih podataka
        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateData data)
        {
            // Proverava da li je ID validan
            if (id <= 0)
                BadRequest("Invalid request has been made!");

            // Proverava JWT token i upoređuje ID iz tokena sa prosleđenim ID-jem
            if (!int.TryParse(JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "id"), out int jwt_id) || jwt_id != id)
                return Unauthorized("You don't have permission to read user data!");

            try
            {
                // Poziva servis za ažuriranje korisnika po ID-ju
                bool uspesno = await UsersServices.UpdateUserById(id, data);

                // Proverava da li je korisnik ažuriran
                if (uspesno)
                    return Ok("");
                else
                    return BadRequest("Invalid request has been made!");
            }
            catch
            {
                // Vraća statusni kod 500 u slučaju greške
                return StatusCode(500);
            }
        }

        // HTTP PATCH metoda za promenu statusa verifikacije vozaca
        [HttpPatch("verify/{id}/{verificationStatus}")]
        public async Task<IActionResult> VerifyUser(int id, bool verificationStatus)
        {
            // Proverava da li je ID validan
            if (id <= 0)
                BadRequest("Invalid request has been made!");

            // Proverava JWT rolu da li je Admin (samo admin moze da menja status)
            if (JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != UserRole.Admin.ToString())
                return Unauthorized("You don't have permission to read user data!");

            try
            {
                // Poziva servis za dobijanje azuriranje statusa verifikacije korisnika po ID-ju
                bool uspesno = await UsersServices.UpdateUserVerificationStatusById(id, verificationStatus);

                // Proverava da li je korisnikov status verifikacije uspesno azuriran
                if (uspesno)
                {
                    // Dobavljanje email korisnika
                    UserData user = await UsersServices.GetUserById(id);

                    if (user.Id != 0)
                    {
                        string email = user.Email;
                        string poruka = $"Status Vašeg naloga je promenjen u: {(verificationStatus ? "odobreno" : "odbijen")}";

                        // Slanje email notifikacije da je status verifikacije azuriran
                        await ServiceProxy.Create<IEmailsServices>(new Uri("fabric:/Fabric/EmailsServices")).AddEmail(email, poruka);
                    }

                    return Ok("Verification status has been updated!");
                }
                else
                    return NotFound("User profile couldn't be found!");
            }
            catch
            {
                // Vraća statusni kod 500 u slučaju greške
                return StatusCode(500);
            }
        }

        // HTTP PATCH metoda za promenu statusa blokiranja vozaca
        [HttpPatch("block/{id}/{blockStatus}")]
        public async Task<IActionResult> BlockUser(int id, bool blockStatus)
        {
            // Proverava da li je ID validan
            if (id <= 0)
                BadRequest("Invalid request has been made!");

            // Proverava JWT rola jeste Admin (samo admin moze da menja status)
            if (JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != UserRole.Admin.ToString())
                return Unauthorized("You don't have permission to read user data!");

            try
            {
                // Poziva servis za dobijanje azuriranje statusa blokiranja korisnika po ID-ju
                bool uspesno = await UsersServices.UpdateUserBlockStatusById(id, blockStatus);

                // Proverava da li je korisnikov status uspesno azuriran
                if (uspesno)
                    return Ok("Blockage status has been updated!");
                else
                    return NotFound("User profile couldn't be found!");
            }
            catch
            {
                // Vraća statusni kod 500 u slučaju greške
                return StatusCode(500);
            }
        }

        // HTTP GET metoda za dobavljanje svih vozaca
        [HttpGet("drivers")]
        public async Task<IActionResult> GetDrivers()
        {
            // Proverava JWT rolu da li je Admin (samo admin moze da cita sve vozace)
            if (JwtHelper.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != UserRole.Admin.ToString())
                return Unauthorized("You don't have permission to read users data!");

            try
            {
                // Poziva servis za dobijanje svih vozaca
                return Ok(await UsersServices.GetDrivers());
            }
            catch
            {
                // Vraća statusni kod 500 u slučaju greške
                return StatusCode(500);
            }
        }
    }
}
