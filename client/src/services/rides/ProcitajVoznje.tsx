import axios, { AxiosResponse } from "axios";
import { PodaciVoznja } from "../../models/rides/PodaciVoznja";

export const ProcitajVoznje = async (
  token: string,
  user_id: number
): Promise<PodaciVoznja[]> => {
  try {
    if (!token || token === "") return [];

    const response: AxiosResponse = await axios.get(
      import.meta.env.VITE_API_URL + `rides/all/${user_id}`,
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
