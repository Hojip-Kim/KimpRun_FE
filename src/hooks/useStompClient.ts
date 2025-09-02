import { useEffect, useRef, useCallback, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { clientEnv } from '@/utils/env';

export interface StompSubscription {
  topic: string;
  callback: (message: IMessage) => void;
}

export interface UseStompClientOptions {
  autoConnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  heartbeatIncoming?: number;
  heartbeatOutgoing?: number;
  debug?: boolean;
}

export const useStompClient = (options: UseStompClientOptions = {}) => {
  const {
    autoConnect = true,
    reconnectDelay = 5000,
    maxReconnectAttempts = 5,
    heartbeatIncoming = 10000,
    heartbeatOutgoing = 10000,
    debug = false,
  } = options;

  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // STOMP URL 유효성 검사
  const validateStompUrl = useCallback(() => {
    if (!clientEnv.STOMP_URL) {
      throw new Error(
        'STOMP_URL이 환경변수에 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_STOMP_URL을 설정해주세요.'
      );
    }
    return clientEnv.STOMP_URL;
  }, []);

  // 연결 함수
  const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      return;
    }

    if (isConnecting) {
      return;
    }

    try {
      const stompUrl = validateStompUrl();
      setIsConnecting(true);
      setConnectionError(null);

      // 기존 클라이언트 정리
      if (clientRef.current) {
        clientRef.current.deactivate();
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      const client = new Client({
        brokerURL: stompUrl,
        heartbeatIncoming,
        heartbeatOutgoing,
        reconnectDelay: 0, // 수동으로 재연결 관리

        onConnect: () => {
          setIsConnected(true);
          setIsConnecting(false);
          setConnectionError(null);
          reconnectAttemptsRef.current = 0;

          // 기존 구독들 복원
          subscriptionsRef.current.forEach((subscription, topic) => {
            try {
              client.subscribe(topic, subscription.callback);
            } catch (error) {
              console.error(`❌ 구독 복원 실패 ${topic}:`, error);
            }
          });
        },

        onStompError: (frame) => {
          const errorMessage =
            frame.headers['message'] || 'Unknown STOMP error';
          console.error('❌ STOMP 오류:', errorMessage);
          console.error('상세:', frame.body);
          setConnectionError(errorMessage);
          setIsConnected(false);
          setIsConnecting(false);
        },

        onWebSocketClose: (event) => {
          setIsConnected(false);
          setIsConnecting(false);

          // 정상 종료가 아니고 재연결 시도 가능한 경우
          if (
            event.code !== 1000 &&
            reconnectAttemptsRef.current < maxReconnectAttempts
          ) {
            const delay = Math.min(
              reconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
              30000
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current++;
              connect();
            }, delay);
          } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.error('❌ 최대 재연결 시도 횟수 초과');
            setConnectionError(
              '연결에 실패했습니다. 페이지를 새로고침해주세요.'
            );
          }
        },

        onWebSocketError: (error) => {
          console.error('❌ STOMP WebSocket 오류:', error);
          setConnectionError('WebSocket 연결 오류');
          setIsConnected(false);
          setIsConnecting(false);
        },
      });

      clientRef.current = client;
      client.activate();
    } catch (error) {
      console.error('❌ STOMP 클라이언트 생성 실패:', error);
      setConnectionError(
        error instanceof Error ? error.message : 'Unknown error'
      );
      setIsConnecting(false);
    }
  }, [
    validateStompUrl,
    isConnecting,
    debug,
    heartbeatIncoming,
    heartbeatOutgoing,
    reconnectDelay,
    maxReconnectAttempts,
  ]);

  // 연결 해제 함수
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // 구독 함수
  const subscribe = useCallback(
    (topic: string, callback: (message: IMessage) => void) => {
      subscriptionsRef.current.set(topic, { topic, callback });

      if (clientRef.current?.connected) {
        try {
          const subscription = clientRef.current.subscribe(topic, callback);

          return subscription;
        } catch (error) {
          console.error(`❌ 구독 실패 ${topic}:`, error);
        }
      }
    },
    [debug]
  );

  // 구독 해제 함수
  const unsubscribe = useCallback(
    (topic: string) => {
      subscriptionsRef.current.delete(topic);
    },
    [debug]
  );

  // 메시지 발송 함수
  const publish = useCallback(
    (destination: string, body: any, headers?: any) => {
      if (clientRef.current?.connected) {
        try {
          clientRef.current.publish({
            destination,
            body: typeof body === 'string' ? body : JSON.stringify(body),
            headers,
          });
        } catch (error) {
          console.error(`❌ 메시지 발송 실패 ${destination}:`, error);
        }
      } else {
        console.warn(`⚠️ 연결되지 않음. 메시지 발송 실패: ${destination}`);
      }
    },
    [debug]
  );

  // 자동 연결
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    connectionError,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
  };
};
