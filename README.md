## Taxi aplikacija - Popravka problema sa pokretanjem projekta u Visual Studio

U slučaju da Visual Studio 2022 ne pokreće projekat, možete isprobati sledeće korake:

1. Pokrenite PowerShell kao administrator.
2. Unesite sledeću komandu:
    ```powershell
    Get-Process | Where-Object {$_.Name -eq "UsersServices" -or $_.Name -eq "RidesServices" -or $_.Name -eq "EmailsServices" -or $_.Name -eq "APIRouter"} | Stop-Process -Force
    ```
   Ova komanda zaustavlja procese koji mogu ometati pokretanje projekta.

3. Opciono, možete ažurirati pakete za ASP .NET Web aplikaciju. Unesite sledeću komandu:
    ```powershell
    Update-Package Microsoft.CodeDom.Providers.DotNetCompilerPlatform -r
    ```
   Ova komanda osvežava pakete u projektu.

Nakon izvršenja ovih koraka, pokušajte ponovo pokrenuti projekat u Visual Studio 2022.
