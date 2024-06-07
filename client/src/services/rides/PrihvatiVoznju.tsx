import axios, { AxiosResponse } from "axios";
import {
  PodaciVoznja,
  _init_podaciVoznja,
} from "../../models/rides/PodaciVoznja";

export const PrihvatiVoznju = async (
  token: string,
  voznja: PodaciVoznja
): Promise<PodaciVoznja> => {
  try {
    if (!token || token === "") return _init_podaciVoznja;

    const response: AxiosResponse = await axios.patch(
      import.meta.env.VITE_API_URL +
        `rides/accept/${voznja.id}/${voznja.userId}`,
      {},
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
