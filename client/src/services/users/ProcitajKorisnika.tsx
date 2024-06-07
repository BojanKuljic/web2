import axios, { AxiosResponse } from "axios";
import {
  PodaciKorisnika,
  _init_korisnik,
} from "../../models/users/PodaciKorisnika";

export const ProcitajKorisnika = async (
  token: string,
  user_id: number
): Promise<PodaciKorisnika> => {
  try {
    if (!token || token === "") return _init_korisnik;

    const response: AxiosResponse = await axios.get(
      import.meta.env.VITE_API_URL + `users/get/${user_id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return _init_korisnik;
    }
  } catch {
    return _init_korisnik;
  }
};
