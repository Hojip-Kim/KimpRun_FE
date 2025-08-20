export interface ChatMessage {
  ping: boolean;
  chatId: string;
  content: string;
  authenticated: boolean;
  userIp: string;
  uuid: string;
  registedAt: Date;
}

export interface ChatMessageRequest {
  ping: boolean;
  chatID: string;
  content: string;
  authenticated: boolean;
}
