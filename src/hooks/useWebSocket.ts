import { useEffect, useRef, useCallback } from "react";
import { MarketType } from "@/types/marketType";
import {
  getWebsocketUrl,
  createWebSocketConnection,
  WebSocketManager,
  WebSocketConfig,
  WebSocketMessageHandler,
} from "@/utils/websocket";

interface UseWebSocketProps {
  markets: MarketType[];
  onMessage: (market: MarketType, data: any) => void;
  enabled?: boolean;
}

export const useWebSocket = ({
  markets,
  onMessage,
  enabled = true,
}: UseWebSocketProps) => {
  const wsManagerRef = useRef<WebSocketManager>(new WebSocketManager());

  const connect = useCallback(() => {
    if (!enabled) return;

    // 기존 연결 종료
    wsManagerRef.current.closeAllConnections();

    markets.forEach((market) => {
      const wsUrl = getWebsocketUrl(market);
      if (!wsUrl) {
        console.warn(`⚠️ ${market} 웹소켓 URL이 설정되지 않았습니다.`);
        return;
      }

      const messageHandler: WebSocketMessageHandler = (data) => {
        onMessage(market, data);
      };

      const wsConfig: WebSocketConfig = {
        market,
        url: wsUrl,
        onMessage: messageHandler,
      };

      const ws = createWebSocketConnection(wsConfig);
      wsManagerRef.current.addConnection(market, ws);
    });
  }, [markets, onMessage, enabled]);

  const disconnect = useCallback(() => {
    wsManagerRef.current.closeAllConnections();
  }, []);

  const isConnected = useCallback((market: MarketType): boolean => {
    return wsManagerRef.current.isConnected(market);
  }, []);

  useEffect(() => {
    if (enabled && markets.length > 0) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, enabled, markets]);

  return {
    connect,
    disconnect,
    isConnected,
    wsManager: wsManagerRef.current,
  };
};
