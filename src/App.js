import React, { useEffect, useState } from 'react';

function App() {
  // 스트림별 및 거래소별 데이터를 저장할 상태
  const [data, setData] = useState({
    binance: {
      BTCUSDT: { stream: '', price: '', quantity: '' },
      ETHUSDT: { stream: '', price: '', quantity: '' },
    },
    upbit: {
      'KRW-BTC': { stream: '', price: '', quantity: '' },
      'KRW-ETH': { stream: '', price: '', quantity: '' },
    },
  });

  useEffect(() => {
    const eventSources = {
      binance: new EventSource('http://localhost:3000/api/events/binance'),
      upbit: new EventSource('http://localhost:3000/api/events/upbit'),
    };
    // console.log(eventSources.binance);

    // 공통 메시지 처리 로직
    const handleMessage = (exchange, event) => {
      const { stream, price, Quantity } = JSON.parse(event.data);
      console.log(`Received data from ${exchange}:`, {
        stream,
        price,
        Quantity,
      });

      setData((prevState) => ({
        ...prevState,
        [exchange]: {
          ...prevState[exchange],
          [stream]: { stream, price, quantity: Quantity }, // 스트림 키 변환 로직 제거
        },
      }));
    };
    // 이벤트 리스너 등록
    eventSources.binance.onmessage = (event) => handleMessage('binance', event);
    eventSources.upbit.onmessage = (event) => handleMessage('upbit', event);

    // 오류 처리 및 연결 종료 로직
    Object.values(eventSources).forEach((source) => {
      source.onerror = (e) => {
        console.log('SSE error:', e);
        source.close();
      };
    });

    // 컴포넌트 언마운트 시 모든 EventSource 인스턴스 종료
    return () => {
      Object.values(eventSources).forEach((source) => source.close());
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Received Event Data:</h2>
        {Object.entries(data).map(([exchange, streams]) => (
          <div key={exchange}>
            <h3>{exchange.toUpperCase()} Data:</h3>
            {Object.entries(streams).map(([streamKey, { price, quantity }]) => (
              <div key={streamKey}>
                <p>Stream: {streamKey}</p>
                <p>Price: {price}</p>
                <p>Quantity: {quantity}</p>
              </div>
            ))}
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
