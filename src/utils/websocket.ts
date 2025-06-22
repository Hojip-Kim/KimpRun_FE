import { MarketType } from "@/types/marketType";
import { clientEnv } from "./env";
import { firstDataSet, secondDataSet } from "@/app/types";

// 웹소켓 URL 매핑
export const getWebsocketUrl = (marketType: MarketType): string | null => {
  switch (marketType) {
    case MarketType.UPBIT:
      return clientEnv.UPBIT_WEBSOCKET_URL || null;
    case MarketType.BINANCE:
      return clientEnv.BINANCE_WEBSOCKET_URL || null;
    case MarketType.COINONE:
      return clientEnv.COINONE_WEBSOCKET_URL || null;
    case MarketType.BITHUMB:
      return clientEnv.BITHUMB_WEBSOCKET_URL || null;
    default:
      return null;
  }
};

// 웹소켓 메시지 핸들러 타입
export type WebSocketMessageHandler = (data: any) => void;

// 웹소켓 연결 설정 타입
export interface WebSocketConfig {
  market: MarketType;
  url: string;
  onMessage: WebSocketMessageHandler;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
}

// 웹소켓 연결 생성 함수
export const createWebSocketConnection = (
  config: WebSocketConfig
): WebSocket => {
  const { market, url, onMessage, onOpen, onClose, onError } = config;

  const ws = new WebSocket(url);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error(`❌ ${market} 웹소켓 메시지 파싱 오류:`, error);
    }
  };

  ws.onopen = () => {
    onOpen?.();
  };

  ws.onclose = (event) => {
    onClose?.(event);
  };

  ws.onerror = (error) => {
    console.error(`❌ ${market} 웹소켓 오류:`, error);
    onError?.(error);
  };

  return ws;
};

export class WebSocketManager {
  private connections: Map<MarketType, WebSocket> = new Map();

  // 연결 추가 (기존 연결이 있다면 종료)
  addConnection(market: MarketType, ws: WebSocket): void {
    this.closeConnection(market);
    this.connections.set(market, ws);
  }

  // 특정 연결 종료
  closeConnection(market: MarketType): void {
    const ws = this.connections.get(market);
    if (ws) {
      ws.close();
      this.connections.delete(market);
    }
  }

  // 모든 연결 종료
  closeAllConnections(): void {
    this.connections.forEach((ws) => ws.close());
    this.connections.clear();
  }

  // 연결 상태 확인
  isConnected(market: MarketType): boolean {
    const ws = this.connections.get(market);
    return ws?.readyState === WebSocket.OPEN;
  }

  // 연결 가져오기
  getConnection(market: MarketType): WebSocket | undefined {
    return this.connections.get(market);
  }
}
