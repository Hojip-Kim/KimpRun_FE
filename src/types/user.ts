export type UserFetch = {
  isAuthenticated: boolean;
  user: {
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
