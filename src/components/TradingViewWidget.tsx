import { AppDispatch, RootState } from '@/redux/store';
import Script from 'next/script';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const TradingViewWidget = () => {
  const dispatch: AppDispatch = useDispatch();

  const widgetToken = useSelector((state: RootState) => state.widget.token);

  useEffect(() => {
    const token = widgetToken ? widgetToken + 'KRW' : 'BTCKRW';

    const loadWidget = () => {
      new TradingView.widget({
        autosize: true,
        symbol: `${token}`,
        interval: '240',
        timezone: 'Etc/UTC',
        style: '1',
        theme: 'dark',
        locale: 'kr',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        watchlist: [
          'BINANCE:BTCUSDT',
          'BINANCE:ETHUSDT',
          'SP:SPX',
          'CRYPTOCAP:BTC.D',
          'NASDAQ:IXIC',
        ],
        details: true,
        hotlist: true,
        calendar: true,
        studies: ['STD;SMA'],
        container_id: 'chart',
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '650',
      });
    };

    // TradingView 스크립트가 로드된 후 위젯을 초기화
    if (window.TradingView) {
      loadWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.onload = loadWidget;
      document.head.appendChild(script);
    }
  }, [widgetToken]);

  return <div id="chart"></div>;
};

export default TradingViewWidget;
