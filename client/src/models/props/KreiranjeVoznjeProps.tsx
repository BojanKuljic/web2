import { PodaciVoznja } from "../rides/PodaciVoznja";

export interface KreiranjeVoznjeProps {
  KreirajVoznju: (token: string, data: PodaciVoznja) => Promise<PodaciVoznja>;
}
