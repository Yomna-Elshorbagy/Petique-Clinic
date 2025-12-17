export interface UsersOverview {
  totalUsers: number;
  pendingUsers: number;
  verifiedUsers: number;
  blockedUsers: number;
  deletedUsers: number;
}

export interface DeletedUsersHistory {
  _id: string;
  count: number;
  users: { _id: string; email: string; userName: string }[];
}

export interface DeletedUsersAnalysis {
  success: boolean;
  totalUsers: number;
  totalSoftDeleted: number;
  history: DeletedUsersHistory[];
}

export interface Demographics {
  data: {
    gender: Record<string, number>;
    roles: Record<string, number>;
  };
}