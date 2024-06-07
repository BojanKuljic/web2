import { PodaciVoznja } from "../rides/PodaciVoznja";

export interface PrihvatanjeVoznjeProps {
  ProcitajDostupneVoznje: (token: string) => Promise<PodaciVoznja[]>;
  PrihvatiVoznju: (
    token: string,
    voznja: PodaciVoznja
  ) => Promise<PodaciVoznja>;
}
