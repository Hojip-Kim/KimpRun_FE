interface UserInfo {
  isAuthenticated: boolean;
  member?: Member;
  uuid: string;
}

interface Member {
  memberId: number;
  email: string;
  name: string;
  role: string;
}

export type { UserInfo, Member };
