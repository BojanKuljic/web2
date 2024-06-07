import axios, { AxiosResponse } from "axios";
import { PodaciVoznja } from "../../models/rides/PodaciVoznja";

export const ProcitajDostupneVoznje = async (
  token: string
): Promise<PodaciVoznja[]> => {
  try {
    if (!token || token === "") return [];

    const response: AxiosResponse = await axios.get(
      import.meta.env.VITE_API_URL + `rides/available`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};
