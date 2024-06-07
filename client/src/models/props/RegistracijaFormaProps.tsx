import { PodaciZaRegistraciju } from "../auth/PodaciZaRegistraciju";

export interface RegistracijaFormaProps {
  Registracija: (podaci: PodaciZaRegistraciju) => Promise<string>;
  GooglePrijava: (googleToken: string) => Promise<string>;
}
