import { PodaciVoznja } from "../rides/PodaciVoznja";

export interface DostupneVoznjeProps {
  voznja: PodaciVoznja;
  PrihvatiVoznju: (token: string, voznja: PodaciVoznja) => Promise<PodaciVoznja>;
}
