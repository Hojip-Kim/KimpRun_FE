import { Notice } from '@/components/notice/type';

export interface User {
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface NoticeState {
  notice: Notice[];
  isNewNoticeGenerated: boolean;
}

export interface InfoState {
  tether: number;
  user: number;
  dollar: number;
}

export interface TokenState {
  tokenList: { first: string[]; second: string[] };
  tokenSet: { first: { [key: string]: string }; second: { [key: string]: string } };
}

export interface WidgetState {
  token: string;
  currency: string;
  interval: string;
  tokenPrice: number;
  kimp: number;
}

