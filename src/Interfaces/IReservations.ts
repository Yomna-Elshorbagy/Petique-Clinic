export interface Reservation {
  _id: string;
  date: string;
  time: string;
  status: string;

  petOwner: {
    _id: string;
    userName: string;
    email: string;
    mobileNumber: string;
  };

  pet: {
    _id: string;
    name: string;
    age: number;
    type: string;
  };

  service: {
    _id: string;
    name: string;
    price: number;
  };

  doctor: {
    _id: string;
    userName: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ReservationResponse {
  success: boolean;
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    prevPage: number | null;
    nextPage: number | null;
  };
  data: Reservation[];
}