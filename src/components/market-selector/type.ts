interface UserInfo {
  isAuthenticated: boolean;
  member?: Member;
  uuid: string;
}

interface Member {
  id?: number;
  email: string;
  name: string;
  role: string;
}

export type { UserInfo, Member };
