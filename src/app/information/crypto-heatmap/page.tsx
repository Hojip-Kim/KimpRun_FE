'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Head from 'next/head';
import InformationLayout from '../client/InformationLayout';
import InformationSubNav from '../client/InformationSubNav';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

// 전체화면 스타일 컨테이너
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: ${palette.bgPage};

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    margin-bottom: 80px; // 모바일 탭바 여백
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: ${palette.textSecondary};
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
`;

// 위젯 컨테이너
const WidgetContainer = styled.div`
  width: 100%;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: ${palette.shadow};

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

interface TradingViewCryptoHeatmapProps {
  width?: string | number;
  height?: string | number;
  colorTheme?: 'light' | 'dark';
  dataSource?: string;
  blockSize?: string;
  blockColor?: string;
}

// 로딩 스피너 컴포넌트
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  color: ${palette.textSecondary};
  font-size: 0.875rem;

  &:before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid ${palette.border};
    border-top: 2px solid ${palette.accent};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// TradingView 위젯 컨테이너 스타일
const TradingViewWidgetContainer = styled.div`
  width: 100%;
  height: 700px;
  position: relative;

  @media (max-width: 768px) {
    height: 500px;
  }

  @media (max-width: 480px) {
    height: 400px;
  }

  .tradingview-widget-container__widget {
    width: 100% !important;
    height: 100% !important;
    min-height: inherit !important;
    position: relative !important;

    iframe {
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      display: block !important;
    }
  }
`;

const CopyrightContainer = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: ${palette.bgContainer};
  border-top: 1px solid ${palette.border};

  a {
    color: ${palette.accent};
    text-decoration: none;
    font-size: 0.75rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// TradingView Crypto Heatmap 컴포넌트 (공식 예제 기반)
const CryptoHeatmapWidget: React.FC<TradingViewCryptoHeatmapProps> = React.memo(
  () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [widgetHeight, setWidgetHeight] = React.useState(700);

    // 화면 크기에 따른 높이 설정
    useEffect(() => {
      const updateHeight = () => {
        if (window.innerWidth <= 480) {
          setWidgetHeight(400);
        } else if (window.innerWidth <= 768) {
          setWidgetHeight(500);
        } else {
          setWidgetHeight(700);
        }
      };

      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
      setIsLoading(true);
      setHasError(false);

      // 타이머로 에러 처리 (10초 후)
      const errorTimer = setTimeout(() => {
        if (isLoading) {
          setHasError(true);
          setIsLoading(false);
        }
      }, 10000);

      const loadWidget = () => {
        if (!containerRef.current) return;

        const script = document.createElement('script');
        script.src =
          'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = `
        {
          "dataSource": "Crypto",
          "blockSize": "market_cap_calc",
          "blockColor": "change",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": false,
          "isDataSetEnabled": true,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": false,
          "width": "100%",
          "height": "${widgetHeight}"
        }`;

        script.onload = () => {
          clearTimeout(errorTimer);

          // iframe이 로드되었는지 확인
          const checkIframe = () => {
            const iframe = containerRef.current?.querySelector('iframe');
            if (iframe) {
              setIsLoading(false);
            } else {
              setTimeout(checkIframe, 100);
            }
          };

          setTimeout(checkIframe, 1000);
        };

        script.onerror = () => {
          clearTimeout(errorTimer);
          setHasError(true);
          setIsLoading(false);
        };

        // 기존 내용 제거
        containerRef.current.innerHTML = '';

        // 위젯 컨테이너 div 추가 (공식 구조)
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'tradingview-widget-container__widget';
        containerRef.current.appendChild(widgetDiv);

        // 스크립트 추가
        containerRef.current.appendChild(script);
      };

      // 약간의 딜레이 후 위젯 로드
      const timer = setTimeout(loadWidget, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(errorTimer);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }, [hasError, widgetHeight]); // hasError와 widgetHeight가 변경될 때 재실행

    if (hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '400px',
            color: '#666',
            flexDirection: 'column',
          }}
        >
          <p>위젯을 불러올 수 없습니다.</p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
            style={{
              padding: '0.5rem 1rem',
              marginTop: '1rem',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return (
      <>
        {isLoading && <LoadingSpinner>히트맵을 불러오는 중...</LoadingSpinner>}
        <TradingViewWidgetContainer
          className="tradingview-widget-container"
          ref={containerRef}
          style={{
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease',
            height: `${widgetHeight}px`,
          }}
        />
        <CopyrightContainer>
          <a
            href="https://www.tradingview.com/markets/cryptocurrencies/"
            rel="noopener nofollow"
            target="_blank"
          >
            <span style={{ color: '#2196F3' }}>
              Crypto coins heatmap by TradingView
            </span>
          </a>
        </CopyrightContainer>
      </>
    );
  }
);

export default function CryptoHeatmapPage() {
  const pathname = usePathname();

  return (
    <>
      <Head>
        <title>코인 히트맵 | 암호화폐 시장 시각화 | 김프런 | kimprun</title>
        <meta
          name="description"
          content="실시간 암호화폐 시장을 시가총액과 가격 변동률로 시각화한 인터랙티브 히트맵입니다. 비트코인, 이더리움 등 주요 코인들의 시장 성과를 색상과 크기로 한눈에 파악하세요."
        />
        <meta
          name="keywords"
          content="코인 히트맵, 암호화폐 히트맵, 비트코인, 이더리움, 시가총액, 가격 변동률, 차트, 시각화, 실시간"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="canonical"
          href="https://kimprun.com/information/crypto-heatmap"
        />
      </Head>

      <InformationLayout>
        <InformationSubNav currentPath={pathname} />
        <Container>
          <Header>
            <Title>코인 히트맵</Title>
            <Description>
              암호화폐 시장을 시가총액과 가격 변동률로 시각화한 히트맵입니다.
              색상과 크기로 각 코인의 시장 상황을 한눈에 파악하세요.
            </Description>
          </Header>

          <WidgetContainer>
            <CryptoHeatmapWidget />
          </WidgetContainer>
        </Container>
      </InformationLayout>
    </>
  );
}
