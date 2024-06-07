import axios, { AxiosResponse } from "axios";
import { PodaciKorisnika } from "../../models/users/PodaciKorisnika";

export const ProcitajVozace = async (
  token: string
): Promise<PodaciKorisnika[]> => {
  try {
    if (!token || token === "") return [];

    const response: AxiosResponse = await axios.get(
      import.meta.env.VITE_API_URL + `users/drivers`,
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
