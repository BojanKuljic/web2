import { PodaciKorisnika } from "../users/PodaciKorisnika";

export interface VerifikacijaVozacaProps {
    ProcitajVozace: (token: string) => Promise<PodaciKorisnika[]>;
    PromenaStatusaVerifikacije: (token: string, user_id: number, novi_status: boolean) => Promise<boolean>;
    PromenaStatusaBlokiranja: (token: string, user_id: number, novi_status: boolean) => Promise<boolean>;
}