import axios, { AxiosResponse } from "axios";
import { PodaciZaAzuriranjeKorisnika } from "../../models/users/PodaciZaAzuriranjeKorisnika";

export const AzurirajKorisnickePodatke = async (
  token: string,
  user_id: number,
  podaci: PodaciZaAzuriranjeKorisnika
): Promise<boolean> => {
  try {
    if (!token || token === "") return false;

    // Provera validnosti podataka
    if (
      podaci.username.trim().length < 1 ||
      (podaci.password.trim().length != 0 &&
        podaci.password.trim().length < 6) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(podaci.email.trim()) ||
      podaci.fullname.trim().length < 1 ||
      podaci.address.trim().length < 1
    )
      return false;

    const response: AxiosResponse = await axios.patch(
      import.meta.env.VITE_API_URL + `users/update/${user_id}`,
      podaci,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
