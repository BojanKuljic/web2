import axios, { AxiosResponse } from "axios";
import { PodaciZaPrijavu } from "../../models/auth/PodaciZaPrijavu";

export const Prijava = async (podaci: PodaciZaPrijavu): Promise<string> => {
  // Provera podataka
  if (
    podaci.password.trim().length < 6 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(podaci.email.trim())
  )
    return "";

  try {
    const response: AxiosResponse<string> = await axios.post(
      import.meta.env.VITE_API_URL + "auth/prijava",
      podaci
    );

    if (response.status === 200) {
      return response.data;
    } else return "";
  } catch {
    return "";
  }
};
