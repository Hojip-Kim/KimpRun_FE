export interface ChatMessage {
  ping: boolean;
  chatId: string;
  content: string;
  authenticated: boolean;
  userIp: string;
  uuid: string;
  registedAt: Date | string; // 백엔드에서 문자열로 올 수 있음
  inherenceId: string;
  // isDeleted는 있다면 웹소켓꺼, 없다면 채팅데이터
  isDeleted?: boolean;
  memberId?: number;
  profileImageUrl?: string;
  nickname: string;
}

export interface ChatMessageRequest {
  ping: boolean;
  chatId: string;
  content: string;
  authenticated: boolean;
  memberId?: number;
}
