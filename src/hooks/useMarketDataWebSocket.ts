import { useEffect, useRef, useCallback } from "react";
import { MarketType } from "@/types/marketType";
import { clientEnv } from "@/utils/env";
import { MultipleMarketDataResponse, MarketDataMap } from "@/types/marketData";

interface UseMarketDataWebSocketProps {
  onMarketData?: (marketType: MarketType, data: MarketDataMap) => void;
  enabled?: boolean;
}

export const useMarketDataWebSocket = ({
  onMarketData,
  enabled = true,
}: UseMarketDataWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // 배열을 객체로 변환하는 헬퍼 함수
  const arrayToObject = useCallback((dataArray: any[]): MarketDataMap => {
    const result: MarketDataMap = {};
    dataArray.forEach((item) => {
      if (item.token) {
        result[item.token] = item;
      }
    });
    return result;
  }, []);

  // 웹소켓 메시지 처리
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data: MultipleMarketDataResponse = JSON.parse(event.data);

        if (!onMarketData) {
          return;
        }
        // 각 거래소별로 데이터 처리 - 공통 콜백 사용
        if (data.upbitData) {
          const upbitMap = arrayToObject(data.upbitData);
          onMarketData(MarketType.UPBIT, upbitMap);
        }

        if (data.binanceData) {
          const binanceMap = arrayToObject(data.binanceData);
          onMarketData(MarketType.BINANCE, binanceMap);
        }

        if (data.coinoneData) {
          const coinoneMap = arrayToObject(data.coinoneData);
          onMarketData(MarketType.COINONE, coinoneMap);
        }

        if (data.bithumbData) {
          const bithumbMap = arrayToObject(data.bithumbData);
          onMarketData(MarketType.BITHUMB, bithumbMap);
        }
      } catch (error) {
        console.error("마켓 데이터 웹소켓 메시지 파싱 오류:", error);
        console.error("원본 데이터:", event.data);
      }
    },
    [onMarketData, arrayToObject]
  );

  // 웹소켓 연결
  const connect = useCallback(() => {
    if (!enabled || !clientEnv.MARKET_DATA_WEBSOCKET_URL) {
      console.warn(
        "마켓 데이터 웹소켓이 비활성화되었거나 URL이 설정되지 않음."
      );
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      wsRef.current = new WebSocket(clientEnv.MARKET_DATA_WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = handleMessage;

      wsRef.current.onclose = (event) => {
        // 정상적인 종료가 아니고 재연결 시도 횟수가 남아있다면 재연결 시도
        if (
          enabled &&
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            30000
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };
      wsRef.current.onerror = (error) => {
        console.error("❌ 마켓 데이터 웹소켓 오류:", error);
      };
    } catch (error) {
      console.error("❌ 마켓 데이터 웹소켓 연결 실패:", error);
    }
  }, [enabled, handleMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "정상 종료");
      wsRef.current = null;
    }
  }, []);

  const isConnected = useCallback(() => {
    return wsRef.current?.readyState === WebSocket.OPEN;
  }, []);

  // 컴포넌트 마운트/언마운트 시 연결 관리
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
  };
};
