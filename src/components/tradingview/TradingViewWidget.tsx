'use client';

import { RootState } from '@/redux/store';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  containerId?: string;
}

const TradingViewWidget: React.FC<Props> = ({ containerId = 'chart' }) => {
  const widgetToken = useSelector((state: RootState) => state.widget.token);
  const currency = useSelector((state: RootState) => state.widget.currency);
  const interval = useSelector((state: RootState) => state.widget.interval);
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  const widgetRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastConfigRef = useRef<string>('');

  // 위젯 생성 및 업데이트
  useEffect(() => {
    const token = widgetToken ? widgetToken + currency : 'BTC' + currency;
    const currentConfig = `${token}-${interval}-${currentTheme}`;

    // 설정이 변경되었을 때만 위젯 재생성
    if (lastConfigRef.current === currentConfig) {
      return; // 같은 설정이면 재생성하지 않음
    }

    const loadWidget = () => {
      // 기존 위젯이 있으면 제거
      if (widgetRef.current) {
        try {
          if (widgetRef.current.remove) {
            widgetRef.current.remove();
          }
        } catch (error) {
          console.warn('Widget removal failed:', error);
        }
        widgetRef.current = null;
      }

      // 컨테이너 정리
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }

      // 새 위젯 생성
      try {
        // 모바일 화면 크기 확인
        const isMobile = window.innerWidth <= 768;

        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: `${token}`,
          interval: interval ? interval : '240',
          timezone: 'Asia/Seoul',
          style: '1',
          theme: currentTheme,
          locale: 'kr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          withdateranges: !isMobile, // 모바일에서만 1D, 5D 등 날짜 범위 버튼 숨김
          hide_side_toolbar: true,
          allow_symbol_change: true, // 심볼 변경 유지
          watchlist: [
            // 'BINANCE:BTCUSDT',
            // 'BINANCE:ETHUSDT',
            // 'SP:SPX',
            // 'CRYPTOCAP:BTC.D',
            // 'NASDAQ:IXIC',
          ],
          details: false, // 세부정보 유지 (가격, 변동률 등)
          hotlist: true, // 핫리스트 유지
          calendar: true, // 캘린더 유지
          studies: ['STD;SMA'], // 연구 도구 유지
          container_id: containerId,
          show_popup_button: false, // 팝업 버튼 유지
          popup_width: '1000',
          popup_height: '650',
          // 필요한 정보는 모두 유지하고 1D, 5D 버튼만 제거
          save_image: true, // 이미지 저장 유지
          // 글자 크기 및 UI 최적화 설정
          height: isMobile ? 400 : 500, // 모바일에서 높이 조정
          width: isMobile ? '100%' : '100%',
          hide_symbol_search: isMobile, // 모바일에서 심볼 검색 숨김
          time_frames: isMobile ? [] : undefined, // 모바일에서 시간 프레임 버튼 숨김
        });

        // 설정 저장
        lastConfigRef.current = currentConfig;
      } catch (error) {
        console.error('Widget creation failed:', error);
      }
    };

    // TradingView 스크립트 로드 및 위젯 초기화
    if (window.TradingView) {
      loadWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.onload = loadWidget;
      script.onerror = () => console.error('Failed to load TradingView script');
      document.head.appendChild(script);
    }

    // cleanup 함수
    return () => {
      if (widgetRef.current) {
        try {
          if (widgetRef.current.remove) {
            widgetRef.current.remove();
          }
        } catch (error) {
          console.warn('Widget cleanup failed:', error);
        }
        widgetRef.current = null;
      }
    };
  }, [widgetToken, currency, interval, containerId, currentTheme]); // 모든 설정 포함

  return (
    <div
      id={containerId}
      style={{
        fontSize: '11px', // 전체 글자 크기 축소
      }}
    >
      <style jsx>{`
        #${containerId} iframe {
          font-size: 10px !important;
        }

        /* 모바일에서 TradingView 위젯 글자 크기 조정 */
        @media (max-width: 768px) {
          #${containerId} {
            font-size: 9px !important;
          }

          #${containerId} iframe {
            font-size: 8px !important;
          }

          /* TradingView 내부 요소들 글자 크기 조정 */
          #${containerId} .tv-symbol-header {
            font-size: 9px !important;
          }

          #${containerId} .tv-symbol-header__short-name {
            font-size: 9px !important;
          }

          #${containerId} .tv-symbol-price-quote {
            font-size: 9px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TradingViewWidget;
