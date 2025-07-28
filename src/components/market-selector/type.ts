interface UserInfo {
  isAuthenticated: boolean;
  member: {
    id: number;
    email: string;
    nickname: string;
    role: string;
  };
}

export type { UserInfo };
