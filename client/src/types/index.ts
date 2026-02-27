export enum RequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum BikeStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  INACTIVE = "INACTIVE",
}

export interface Bike {
  bikeNum: string;
  brand: string;
  lot: number;
  ownerMail: string;
  status: BikeStatus;
  createdAt: string;
}

export interface RentalRequest {
  id: string;
  bike: Bike;
  renter: User;
  status: RequestStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string;
  bikes?: Bike[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}