import { PodaciVoznja } from "../rides/PodaciVoznja";

export interface CekanjeUTokuProps {
  ProcitajStatusNaCekanju: (token: string, user_id: number) => Promise<PodaciVoznja>;
  OceniVoznju: (token: string, ride_id: number, ocena: number) => Promise<boolean>;
}