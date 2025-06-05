'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const TwitterFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const widgetId = 'fb09653e-8ab8-478c-91e3-6f27293c4140';

    const initializeWidget = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        const widget = document.createElement('div');
        widget.className = `elfsight-app-${widgetId}`;
        containerRef.current.appendChild(widget);
      }
    };

    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://static.elfsight.com/platform/platform.js';
        script.defer = true;
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initialize = async () => {
      const existingScript = document.querySelector(
        'script[src="https://static.elfsight.com/platform/platform.js"]'
      );

      if (!existingScript) {
        await loadScript();
      }

      setTimeout(() => {
        initializeWidget();
        setIsLoading(false);
      }, 500);
    };

    initialize();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <TwitterContainer>
      {isLoading && (
        <LoadingContainer>
          <TossSpinner>
            <div className="circle"></div>
          </TossSpinner>
        </LoadingContainer>
      )}
      <div ref={containerRef} style={{ opacity: isLoading ? 0 : 1 }} />
    </TwitterContainer>
  );
};

export default TwitterFeed;

const TwitterContainer = styled.div`
  flex: 1;
  min-height: 300px;
  height: 100%;
  margin: 0;
  width: 100%;

  .elfsight-app-fb09653e-8ab8-478c-91e3-6f27293c4140 {
    height: 100% !important;
    min-height: 300px !important;
    overflow-y: auto !important;
    width: 100% !important; 
  }
  iframe {
    width: 100% !important;
  }
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #131722;
`;

const SpinnerAnimation = keyframes`
  0% {
    stroke-dashoffset: 0;
    transform: rotate(0deg);
  }
  50% {
    stroke-dashoffset: 157;
    transform: rotate(180deg);
  }
  100% {
    stroke-dashoffset: 314;
    transform: rotate(360deg);
  }
`;

const TossSpinner = styled.div`
  width: 50px;
  height: 50px;
  position: relative;

  .circle {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 50%;
    border: 4px solid transparent;
    border-top-color: #3182f6;
    border-right-color: #3182f6;
    animation: ${SpinnerAnimation} 1s cubic-bezier(0.42, 0.61, 0.58, 0.41)
      infinite;
  }
`;
