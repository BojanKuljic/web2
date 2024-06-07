export interface PodaciVoznja {
  id: number;
  userId: number;
  driverId?: number | null;
  startAddress: string;
  endAddress: string;
  price: number;
  waitingTime: number;
  travelTime?: number | null;
  rideStatus: 0 | 1 | 2; // 0 - In Progress, 1- Created, 2 - Done
  reviewScore?: number;
}

export const _init_podaciVoznja: PodaciVoznja = {
  id: 0,
  userId: 0,
  driverId: 0,
  startAddress: "",
  endAddress: "",
  price: 0.0,
  waitingTime: 0,
  travelTime: 0,
  rideStatus: 1,
  reviewScore: 0,
};
