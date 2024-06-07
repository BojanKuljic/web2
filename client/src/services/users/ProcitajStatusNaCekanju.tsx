import axios, { AxiosResponse } from "axios";
import { PodaciVoznja, _init_podaciVoznja } from "../../models/rides/PodaciVoznja";

export const ProcitajStatusNaCekanju = async (
  token: string,
  user_id: number
): Promise<PodaciVoznja> => {
  try {
    if (!token || token === "") return _init_podaciVoznja;

    const response: AxiosResponse = await axios.get(
      import.meta.env.VITE_API_URL + `rides/in-progress/${user_id}`,
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
