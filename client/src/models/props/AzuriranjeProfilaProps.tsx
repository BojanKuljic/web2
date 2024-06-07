import { PodaciKorisnika } from "../users/PodaciKorisnika";
import { PodaciZaAzuriranjeKorisnika } from "../users/PodaciZaAzuriranjeKorisnika";

export interface AzuriranjeProfilaProps {
  ProcitajKorisnika: (token: string, user_id: number) => Promise<PodaciKorisnika>;
  AzurirajKorisnickePodatke: (token: string, user_id: number, podaci: PodaciZaAzuriranjeKorisnika) => Promise<boolean>;
}