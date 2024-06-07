import { PodaciVoznja } from "../rides/PodaciVoznja";

export interface PrethodneVoznjeProps {
    ProcitajVoznje: (token: string, user_id: number) => Promise<PodaciVoznja[]>;
}