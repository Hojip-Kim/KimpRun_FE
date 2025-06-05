'use client';

import { useEffect } from 'react';

const TradingViewOverview = () => {

  useEffect(() => {
    const script = document.createElement('script');
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
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    });

    const container = document.querySelector(
      '.tradingview-widget-container__widget'
    );
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && script && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      style={{
        maxWidth: '700px',
        height: '70px',
        marginTop: '5px',
      }}
    >
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
};

export default TradingViewOverview;
