import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  transform: scale(0.9);
  transform-origin: top center;
  width: 111.11%;
  margin-left: -5.56%;
  min-height: calc(100vh / 0.9);

  @media (max-width: 768px) {
    transform: scale(0.95);
    width: 105.26%; // scale(0.95)의 역보정
    margin-left: -2.63%;
    min-height: calc(100vh / 0.95);
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding-top: 110px; // navbar 높이 (top 70px + bottom 40px)
  min-height: 100vh; // 전체 viewport 높이 사용 - 푸터는 스크롤 필요

  @media (max-width: 768px) {
    padding-top: 56px; // 모바일에서 Nav 높이만
    padding-bottom: 88px;
    min-height: 100vh; // 전체 viewport 높이 사용 - 푸터는 스크롤 필요
  }
`;
