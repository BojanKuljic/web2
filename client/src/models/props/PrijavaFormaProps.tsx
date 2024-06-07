import { PodaciZaPrijavu } from "../auth/PodaciZaPrijavu";

export interface PrijavaFormaProps {
  Prijava: (podaci: PodaciZaPrijavu) => Promise<string>;
  GooglePrijava: (googleToken: string) => Promise<string>;
}
