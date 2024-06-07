export interface PodaciZaRegistraciju {
  username: string;
  email: string;
  password: string;
  fullname: string;
  dateOfBirth: Date;
  address: string;
  role: 0 | 1 | 2; // Admin = 0, User = 1, Driver = 2
  profileImage: string;
}

export const _init_registracija: PodaciZaRegistraciju = {
  username: "",
  email: "",
  password: "",
  fullname: "",
  dateOfBirth: new Date("2001-01-01"),
  address: "",
  role: 1,
  profileImage: "",
};
