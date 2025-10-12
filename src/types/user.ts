export interface UserFetch {
  isAuthenticated: boolean;
  member: {
    email: string;
    name: string;
    role: string;
  };
}

export interface User {
  email: string;
  name: string;
  role: string;
  memberId: number;
}
