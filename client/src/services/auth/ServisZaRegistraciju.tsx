import axios, { AxiosResponse } from "axios";
import { PodaciZaRegistraciju } from "../../models/auth/PodaciZaRegistraciju";

export const Registracija = async (
  podaci: PodaciZaRegistraciju
): Promise<string> => {
  // Provera validnosti podataka
  if (
    podaci.username.trim().length < 1 ||
    podaci.password.trim().length < 6 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(podaci.email.trim()) ||
    podaci.fullname.trim().length < 1 ||
    podaci.address.trim().length < 1 ||
    podaci.profileImage.trim().length < 1
  )
    return "";

  try {
    const response: AxiosResponse<string> = await axios.post(
      import.meta.env.VITE_API_URL + "auth/registracija",
      podaci
    );

    if (response.status === 200) {
      return response.data;
    } else return "";
  } catch {
    return "";
  }
};
