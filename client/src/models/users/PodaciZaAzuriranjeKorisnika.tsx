export interface PodaciZaAzuriranjeKorisnika {
  username: string;
  email: string;
  password: string;
  fullname: string;
  dateOfBirth: Date;
  address: string;
  profileImage: string;
}

export const _init_azuriranje: PodaciZaAzuriranjeKorisnika = {
  username: "",
  email: "",
  password: "",
  fullname: "",
  dateOfBirth: new Date("2001-01-01"),
  address: "",
  profileImage: "",
};
