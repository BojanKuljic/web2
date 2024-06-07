import axios, { AxiosResponse } from "axios";
import {
  PodaciVoznja,
  _init_podaciVoznja,
} from "../../models/rides/PodaciVoznja";

export const KreirajVoznju = async (
  token: string,
  podaci: PodaciVoznja
): Promise<PodaciVoznja> => {
  try {
    // Provera validnosti tokena
    if (!token || token === "") return _init_podaciVoznja;

    // Provera validnosti podaka
    if (
      podaci.userId == 0 ||
      podaci.startAddress.trim().length < 1 ||
      podaci.endAddress.trim().length < 1 ||
      podaci.price <= 0.0 ||
      podaci.waitingTime <= 0
    )
      return _init_podaciVoznja;

    const response: AxiosResponse<PodaciVoznja> = await axios.post(
      import.meta.env.VITE_API_URL + `rides/create`,
      podaci,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return _init_podaciVoznja;
    }
  } catch {
    return _init_podaciVoznja;
  }
};
