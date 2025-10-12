import { useEffect, useRef, useCallback, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { clientEnv } from '@/utils/env';
import {
  getCsrfToken,
  forceRefreshCsrfToken,
  getCsrfTokenFromCookie,
} from '@/utils/csrf';

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
}

// 전역 싱글톤 STOMP 클라이언트
class StompClientSingleton {
  private static instance: StompClientSingleton | null = null;
  private client: Client | null = null;
  private subscriptions = new Map<string, StompSubscription>();
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private lastConnectionAttempt = 0;
  private consecutiveFailures = 0;

  private connectionState = {
    isConnected: false,
    isConnecting: false,
    connectionError: null as string | null,
  };

  private stateCallbacks = new Set<
    (state: typeof this.connectionState) => void
  >();
  private options: UseStompClientOptions = {};

  static getInstance(): StompClientSingleton {
    if (!StompClientSingleton.instance) {
      StompClientSingleton.instance = new StompClientSingleton();
    }
    return StompClientSingleton.instance;
  }

  private updateConnectionState(updates: Partial<typeof this.connectionState>) {
    this.connectionState = { ...this.connectionState, ...updates };
    this.stateCallbacks.forEach((callback) => callback(this.connectionState));
  }

  addStateCallback(callback: (state: typeof this.connectionState) => void) {
    this.stateCallbacks.add(callback);
    // 현재 상태를 즉시 전달
    callback(this.connectionState);

    return () => {
      this.stateCallbacks.delete(callback);
    };
  }

  validateStompUrl(): string {
    // 개발 환경에서는 하드코딩된 URL 사용
    const stompUrl = clientEnv.STOMP_URL;

    if (!stompUrl) {
      throw new Error(
        'STOMP_URL이 환경변수에 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_STOMP_URL을 설정해주세요.'
      );
    }
    return stompUrl;
  }

  async connect(options: UseStompClientOptions = {}) {
    if (this.client?.connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    // 너무 빠른 연속 연결 시도 방지 (최소 2초 간격)
    const now = Date.now();
    if (now - this.lastConnectionAttempt < 2000) {
      console.warn('⚠️ 연결 시도가 너무 빠름. 2초 후 다시 시도하세요.');
      return;
    }
    this.lastConnectionAttempt = now;

    // 연속 실패가 너무 많으면 재연결 중단
    if (this.consecutiveFailures >= 10) {
      console.error(
        '❌ 연속 연결 실패가 너무 많습니다. 수동으로 새로고침해주세요.'
      );
      this.updateConnectionState({
        connectionError: '연결 실패가 반복됩니다. 페이지를 새로고침해주세요.',
        isConnecting: false,
      });
      return;
    }

    this.options = { ...this.options, ...options };
    const {
      reconnectDelay = 5000,
      maxReconnectAttempts = 5,
      heartbeatIncoming = 10000,
      heartbeatOutgoing = 10000,
    } = this.options;

    try {
      const stompUrl = this.validateStompUrl();
      this.isConnecting = true;
      this.updateConnectionState({ isConnecting: true, connectionError: null });

      // 기존 클라이언트 정리
      if (this.client) {
        this.client.deactivate();
      }

      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      // CSRF 토큰 준비 및 STOMP 헤더에 추가
      let connectHeaders: Record<string, string> = {};
      try {
        // 1. 먼저 쿠키에서 토큰 확인 (백엔드 쿠키 경로가 / 로 변경됨)
        let csrfToken = getCsrfTokenFromCookie();

        if (!csrfToken) {
          // 2. 서버에서 토큰 요청 (쿠키 자동 설정)
          csrfToken = await getCsrfToken();

          // 3. 쿠키 설정 후 다시 확인 (잠시 대기)
          await new Promise((resolve) => setTimeout(resolve, 100));
          const cookieToken = getCsrfTokenFromCookie();
          if (cookieToken) {
            csrfToken = cookieToken;
          }
        }

        if (csrfToken) {
          // STOMP CONNECT 헤더에 CSRF 토큰 추가
          connectHeaders[csrfToken.headerName] = csrfToken.token;
        } else {
          throw new Error('CSRF 토큰을 가져올 수 없습니다');
        }
      } catch (error) {
        console.error('❌ CSRF 토큰 준비 실패:', error);
        this.isConnecting = false;
        this.updateConnectionState({
          connectionError: 'CSRF 토큰 준비에 실패했습니다.',
          isConnecting: false,
        });
        return;
      }

      const client = new Client({
        brokerURL: stompUrl,
        connectHeaders,
        heartbeatIncoming,
        heartbeatOutgoing,
        reconnectDelay: 0, // 수동으로 재연결 관리

        onConnect: () => {
          this.isConnecting = false;
          this.updateConnectionState({
            isConnected: true,
            isConnecting: false,
            connectionError: null,
          });
          this.reconnectAttempts = 0;
          this.consecutiveFailures = 0; // 성공 시 연속 실패 카운터 리셋

          // 기존 구독들 복원
          this.subscriptions.forEach((subscription, topic) => {
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
          console.error('헤더:', frame.headers);

          // CSRF 관련 오류인지 확인
          const isCsrfError =
            errorMessage.includes('CSRF') ||
            errorMessage.includes('csrf') ||
            errorMessage.includes('403') ||
            frame.body?.includes('CSRF');

          this.isConnecting = false;
          this.consecutiveFailures++; // 실패 카운터 증가

          this.updateConnectionState({
            connectionError: isCsrfError
              ? 'CSRF 토큰 검증 실패. 페이지를 새로고침해주세요.'
              : errorMessage,
            isConnected: false,
            isConnecting: false,
          });
        },

        onWebSocketClose: (event) => {
          this.isConnecting = false;
          this.updateConnectionState({
            isConnected: false,
            isConnecting: false,
          });

          // 정상 종료가 아니고 재연결 시도 가능한 경우
          if (
            event.code !== 1000 &&
            this.reconnectAttempts < maxReconnectAttempts
          ) {
            const delay = Math.min(
              reconnectDelay * Math.pow(2, this.reconnectAttempts),
              30000
            );

            this.reconnectTimeout = setTimeout(() => {
              this.reconnectAttempts++;
              this.connect();
            }, delay);
          } else if (this.reconnectAttempts >= maxReconnectAttempts) {
            console.error('❌ 최대 재연결 시도 횟수 초과');
            this.updateConnectionState({
              connectionError:
                '연결에 실패했습니다. 페이지를 새로고침해주세요.',
            });
          }
        },

        onWebSocketError: (error) => {
          console.error('❌ STOMP WebSocket 오류:', error);
          this.isConnecting = false;
          this.consecutiveFailures++; // 실패 카운터 증가

          // WebSocket 연결 자체가 실패한 경우 (서버가 꺼져있거나 URL이 잘못된 경우)
          const errorMessage = 'WebSocket 연결 실패. 서버 상태를 확인해주세요.';
          console.error('🔍 WebSocket URL:', this.validateStompUrl());
          console.error('🔍 연속 실패 횟수:', this.consecutiveFailures);

          this.updateConnectionState({
            connectionError: errorMessage,
            isConnected: false,
            isConnecting: false,
          });
        },
      });

      this.client = client;
      client.activate();
    } catch (error) {
      console.error('❌ STOMP 클라이언트 생성 실패:', error);
      this.isConnecting = false;
      this.updateConnectionState({
        connectionError:
          error instanceof Error ? error.message : 'Unknown error',
        isConnecting: false,
      });
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.isConnecting = false;
    this.updateConnectionState({ isConnected: false, isConnecting: false });
  }

  subscribe(topic: string, callback: (message: IMessage) => void) {
    this.subscriptions.set(topic, { topic, callback });

    if (this.client?.connected) {
      try {
        const subscription = this.client.subscribe(topic, callback);

        return subscription;
      } catch (error) {
        console.error(`❌ 구독 실패 ${topic}:`, error);
      }
    } else {
    }
  }

  unsubscribe(topic: string) {
    this.subscriptions.delete(topic);
  }

  publish(destination: string, body: any, headers?: any) {
    if (this.client?.connected) {
      try {
        this.client.publish({
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
  }

  isConnectedState() {
    return this.connectionState.isConnected;
  }
}

export const useStompClientSingleton = (
  options: UseStompClientOptions = {}
) => {
  const singleton = StompClientSingleton.getInstance();
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    isConnecting: false,
    connectionError: null as string | null,
  });

  useEffect(() => {
    const unsubscribe = singleton.addStateCallback(setConnectionState);
    return unsubscribe;
  }, []);

  const connect = useCallback(() => {
    singleton.connect(options);
  }, [options]);

  const disconnect = useCallback(() => {
    singleton.disconnect();
  }, []);

  const subscribe = useCallback(
    (topic: string, callback: (message: IMessage) => void) => {
      return singleton.subscribe(topic, callback);
    },
    []
  );

  const unsubscribe = useCallback((topic: string) => {
    singleton.unsubscribe(topic);
  }, []);

  const publish = useCallback(
    (destination: string, body: any, headers?: any) => {
      singleton.publish(destination, body, headers);
    },
    []
  );

  // 자동 연결
  useEffect(() => {
    if (options.autoConnect !== false) {
      connect();
    }

    return () => {
      // 컴포넌트 언마운트 시 구독만 해제, 연결은 유지
      // disconnect(); // 주석 처리하여 연결 유지
    };
  }, [options.autoConnect, connect]);

  return {
    ...connectionState,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
  };
};
