import axios, { AxiosResponse } from "axios";

export const OceniVoznju = async (
  token: string,
  ride_id: number,
  ocena: number
): Promise<boolean> => {
  try {
    if (!token || token === "") return false;

    const response: AxiosResponse = await axios.patch(
      import.meta.env.VITE_API_URL + `rides/review/${ride_id}/${ocena}`,
      {},
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
