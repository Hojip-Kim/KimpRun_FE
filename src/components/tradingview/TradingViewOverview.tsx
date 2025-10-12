'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const TradingViewOverview = () => {
  const currentTheme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initializeWidget = () => {
      const container = document.querySelector(
        '.tradingview-widget-container__widget'
      );

      if (!container) return;

      // 기존 스크립트 정리
      container.innerHTML = '';

      script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          {
            proName: 'FOREXCOM:SPXUSD',
            title: 'S&P 500 Index',
          },
          {
            description: 'Nasdaq',
            proName: 'NASDAQ:NDX',
          },
          {
            description: 'Bitcoin',
            proName: 'BITSTAMP:BTCUSD',
          },
          {
            description: 'Etherium',
            proName: 'BITSTAMP:ETHUSD',
          },
          {
            description: 'Bitcoin Dominance',
            proName: 'CRYPTOCAP:BTC.D',
          },
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: 'compact',
        colorTheme: currentTheme,
        locale: 'en',
        width: '100%',
        height: 70,
      });

      container.appendChild(script);
    };

    // 테마가 변경되면 위젯 재초기화
    initializeWidget();

    return () => {
      const container = document.querySelector(
        '.tradingview-widget-container__widget'
      );
      if (container && script && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [currentTheme]); // 테마 변경 시 재초기화

  return (
    <div
      className="tradingview-widget-container"
      style={{
        width: '100%',
        minWidth: '800px',
        maxWidth: '1400px',
        height: '70px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ width: '100%', height: '100%' }}
      ></div>
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
};

export default TradingViewOverview;
