import type { IUser } from "../IUser";

export interface userFilterProps {
  searchId: string;
  setSearchId: (v: string) => void;

  searchName: string;
  setSearchName: (v: string) => void;

  searchEmail: string;
  setSearchEmail: (v: string) => void;

  searchPhone: string;
  setSearchPhone: (v: string) => void;

  statusFilter: string;
  setStatusFilter: (v: string) => void;

  resetFilters: () => void;
}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user?: IUser | null;
}

export interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
}
