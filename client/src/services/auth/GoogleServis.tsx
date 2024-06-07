import axios, { AxiosResponse } from "axios";
import { PodaciZaRegistraciju } from "../../models/auth/PodaciZaRegistraciju";
import { jwtDecode } from "jwt-decode";

export const GooglePrijava = async (googleToken: string): Promise<string> => {
  // Ekstrakcija podataka iz Google JWT tokena
  const { email, name, picture } = jwtDecode<{
    email: string;
    name: string;
    picture: string;
  }>(googleToken);

  // Kreiranje promenljive za podatke
  const podaci: PodaciZaRegistraciju = {
    username: email.split("@")[0],
    email: email,
    password: "32HUd1921",
    fullname: name,
    dateOfBirth: new Date("2001-12-31"),
    address: "/",
    role: 1,
    profileImage: picture,
  };

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
      import.meta.env.VITE_API_URL + "auth/google",
      podaci
    );

    if (response.status === 200) {
      return response.data;
    } else return "";
  } catch {
    return "";
  }
};
