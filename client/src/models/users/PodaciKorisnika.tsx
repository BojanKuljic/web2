export interface PodaciKorisnika {
  id: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: Date;
  address: string;
  role: 0 | 1 | 2;
  profileImage: string;
  accountVerificationStatus: 0 | 1 | 2;
  isBlocked: boolean;
  isOnWait: boolean;
  isGoogleAccount: boolean;
  ratingScore: number;
}

export const _init_korisnik: PodaciKorisnika = {
  id: 0,
  username: "",
  email: "",
  password: "",
  fullName: "",
  dateOfBirth: new Date("2001-01-01"),
  address: "",
  role: 0,
  profileImage: "",
  accountVerificationStatus: 0,
  isBlocked: false,
  isOnWait: false,
  isGoogleAccount: false,
  ratingScore: 0,
};
