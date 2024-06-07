import axios, { AxiosResponse } from "axios";

export const PromenaStatusaBlokiranja = async (
  token: string,
  user_id: number,
  novi_status: boolean
): Promise<boolean> => {
  try {
    if (!token || token === "") return false;

    const response: AxiosResponse = await axios.patch(
      import.meta.env.VITE_API_URL + `users/block/${user_id}/${novi_status}`,
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
