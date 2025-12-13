export interface IUser {
  _id: string;

  userName: string;
  email: string;
  password: string;

  mobileNumber?: string;

  role: "admin" | "doctor" | "petOwner";
  gender: "male" | "female";

  isVerified: boolean;
  isActive: boolean;
  status: string;

  image: {
    secure_url: string;
    public_id: string;
  };

  address?: string;
  doctorSpecialist?: string;
  otpCode?: string;
  otpExpire?: string;

  wishlist: string[];

  createdAt: string;
  updatedAt: string;
}

export type ILogin = Pick<IUser, "email" | "password">;

export interface ISignup extends ILogin {
  userName: string;
  re_password: string;
}

export interface IUpdateUser {
  userName?: string;
  mobileNumber?: string;
  gender?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UserState {
    users: IUser[];
    loading: boolean;
    error: string | null;
}
