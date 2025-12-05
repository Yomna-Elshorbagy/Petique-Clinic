export interface IUserBasic {
  _id: string;
  userName: string;
  email?: string;
  mobileNumber?: string;
}

export interface IServiceBasic {
  _id: string;
  title: string;
  price?: number;
}

export interface IDoctorBasic {
  _id: string;
  userName: string;
}

export interface IReservationBasic {
  _id: string;
  date: string;
  timeSlot: string;
}


export interface IClinicReview {
  _id: string;

  comment: string;
  rate: number;

  user: string; 
  doctor: string | null; 
  service: string | null; 
  reservation: string | null; 

  clinic: string;

  isDeleted: boolean;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}


export interface IClinicReviewWithUser {
  _id: string;

  comment: string;
  rate: number;

  user: IUserBasic;
  doctor?: IUserBasic | null;
  service?: IServiceBasic | null;
  reservation?: IReservationBasic | null;

  clinic: string;

  isDeleted: boolean;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
}
