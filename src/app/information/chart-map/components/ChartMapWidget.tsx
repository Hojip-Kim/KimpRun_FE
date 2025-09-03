'use client';

import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Props {
  containerId: string;
  symbol: string;
  interval: string;
  slotId?: number;
  onIntervalChange?: (slotId: number, interval: string) => void;
}

const ChartMapWidget: React.FC<Props> = ({
  containerId,
  symbol,
  interval,
  slotId,
  onIntervalChange,
}) => {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);
  const widgetRef = useRef<any>(null);
  const lastConfigRef = useRef<string>('');

  // 전달받은 props 값을 직접 사용
  const actualSymbol = symbol;
  const actualInterval = interval;

  useEffect(() => {
    const currentConfig = `${actualSymbol}-${actualInterval}-${currentTheme}`;

    // 설정이 변경되었을 때만 위젯 재생성
    if (lastConfigRef.current === currentConfig) {
      return;
    }

    // 강제로 위젯을 새로 만들기 위해 참조 초기화
    lastConfigRef.current = '';
    if (widgetRef.current) {
      widgetRef.current = null;
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
        const isMobile = window.innerWidth <= 768;

        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: actualSymbol,
          interval: actualInterval,
          timezone: 'Asia/Seoul',
          style: '1',
          theme: currentTheme,
          locale: 'kr',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          withdateranges: !isMobile,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          details: true,
          hotlist: false,
          calendar: false,
          studies: [],
          container_id: containerId,
          show_popup_button: false,
          save_image: false,
          height: isMobile ? 300 : 400,
          width: '100%',
          hide_symbol_search: false,
          time_frames: isMobile ? [] : undefined,
        });

        // 위젯이 로드된 후 interval 변경 이벤트 리스너 추가
        if (widgetRef.current && slotId !== undefined && onIntervalChange) {
          widgetRef.current.onChartReady(() => {
            try {
              const chart = widgetRef.current.chart();

              // interval 변경 이벤트 리스너 등록
              chart
                .onIntervalChanged()
                .subscribe(null, (newInterval: string) => {
                  if (slotId !== undefined && onIntervalChange) {
                    onIntervalChange(slotId, newInterval);
                  }
                });
            } catch (error) {
              console.error(
                `Chart ${slotId} event listener setup failed:`,
                error
              );
            }
          });
        }

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
  }, [
    actualSymbol,
    actualInterval,
    containerId,
    currentTheme,
    slotId,
    onIntervalChange,
  ]);

  return (
    <div
      id={containerId}
      style={{
        width: '100%',
        height: '100%',
        fontSize: '11px',
      }}
    >
      <style jsx>{`
        #${containerId} iframe {
          font-size: 10px !important;
        }

        @media (max-width: 768px) {
          #${containerId} {
            font-size: 9px !important;
          }

          #${containerId} iframe {
            font-size: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartMapWidget;
