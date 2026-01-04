export interface Reservation {
  _id: string;
  date: string;
  timeSlot: string;
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
    category: {
      name:string
    };
  };

  service: {
    _id: string;
    title: string;
    priceRange: number;
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

export interface ITrackedReservation extends Reservation {
  trackerStatus: "cancelled" | "completed" | "no_show" | "confirmed" | "waiting" | "scheduled";
}
