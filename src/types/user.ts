export type UserFetch = {
  isAuthenticated: boolean;
  member: {
    email: string;
    name: string;
    role: string;
  };
};

export type User = {
  email: string;
  name: string;
  role: string;
};
