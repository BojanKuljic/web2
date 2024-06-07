import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { PrijavaForma } from "./components/auth/PrijavaForma";
import { Prijava } from "./services/auth/ServisZaPrijavu";
import { GooglePrijava } from "./services/auth/GoogleServis";
import { Registracija } from "./services/auth/ServisZaRegistraciju";
import { RegistracijaForma } from "./components/auth/RegistracijaForma";
import PrivatneRute from "./PrivatneRute";
import { KontrolnaTabla } from "./components/kontrolna-tabla/KontrolnaTabla";
import { Profil } from "./components/profil/Profil";
import { ProcitajKorisnika } from "./services/users/ProcitajKorisnika";
import { AzurirajKorisnickePodatke } from "./services/users/AzurirajKorisnickePodatke";
import { VerifikacijaVozaca } from "./components/verifikacija/VerifikacijaVozaca";
import { ProcitajVozace } from "./services/users/ProcitajVozace";
import { PromenaStatusaVerifikacije } from "./services/users/PromenaStatusaVerifikacije";
import { PromenaStatusaBlokiranja } from "./services/users/PromenaStatusaBlokiranja";
import { PrethodneVoznje } from "./components/prethodne-voznje/PrethodneVoznje";
import { ProcitajVoznje } from "./services/rides/ProcitajVoznje";
import { KreirajVoznju } from "./services/rides/KreirajVoznju";
import { KreiranjeVoznje } from "./components/kreiraj-voznju/KreiranjeVoznje";
import { PrihvatanjeVoznje } from "./components/prihvati-voznju/PrihvatanjeVoznje";
import { ProcitajDostupneVoznje } from "./services/rides/ProcitajDostupneVoznje";
import { PrihvatiVoznju } from "./services/rides/PrihvatiVoznju";
import { CekanjeUToku } from "./components/voznja-u-toku/CekanjeUToku";
import { ProcitajStatusNaCekanju } from "./services/users/ProcitajStatusNaCekanju";
import { OceniVoznju } from "./services/rides/OceniVoznju";

function App() {
  return (
    <>
      <Toaster toastOptions={{ duration: 5000 }} />
      <Routes>
        <Route
          path="/"
          element={
            <PrijavaForma Prijava={Prijava} GooglePrijava={GooglePrijava} />
          }
        />
        <Route
          path="/prijava"
          element={
            <PrijavaForma Prijava={Prijava} GooglePrijava={GooglePrijava} />
          }
        />
        <Route
          path="/registracija"
          element={
            <RegistracijaForma
              Registracija={Registracija}
              GooglePrijava={GooglePrijava}
            />
          }
        />

        {/* Privatne rute */}
        <Route
          path="/tabla"
          element={
            <PrivatneRute roles={["Admin", "User", "Driver"]}>
              <KontrolnaTabla />
            </PrivatneRute>
          }
        />

        <Route
          path="/profil"
          element={
            <PrivatneRute roles={["Admin", "User", "Driver"]}>
              <Profil
                ProcitajKorisnika={ProcitajKorisnika}
                AzurirajKorisnickePodatke={AzurirajKorisnickePodatke}
              />
            </PrivatneRute>
          }
        />

        <Route
          path="/verifikacija-vozaca"
          element={
            <PrivatneRute roles={["Admin"]}>
              <VerifikacijaVozaca
                ProcitajVozace={ProcitajVozace}
                PromenaStatusaVerifikacije={PromenaStatusaVerifikacije}
                PromenaStatusaBlokiranja={PromenaStatusaBlokiranja}
              />
            </PrivatneRute>
          }
        />

        <Route
          path="/prethodne-voznje"
          element={
            <PrivatneRute roles={["Admin", "User", "Driver"]}>
              <PrethodneVoznje ProcitajVoznje={ProcitajVoznje} />
            </PrivatneRute>
          }
        />

        <Route
          path="/nova-voznja"
          element={
            <PrivatneRute roles={["User"]}>
              <KreiranjeVoznje KreirajVoznju={KreirajVoznju} />
            </PrivatneRute>
          }
        />

        <Route
          path="/dostupne-voznje"
          element={
            <PrivatneRute roles={["Driver"]}>
              <PrihvatanjeVoznje
                ProcitajDostupneVoznje={ProcitajDostupneVoznje}
                PrihvatiVoznju={PrihvatiVoznju}
              />
            </PrivatneRute>
          }
        />

        <Route
          path="/cekanje"
          element={
            <PrivatneRute roles={["User", "Driver"]}>
              <CekanjeUToku ProcitajStatusNaCekanju={ProcitajStatusNaCekanju}  OceniVoznju={OceniVoznju} />
            </PrivatneRute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
