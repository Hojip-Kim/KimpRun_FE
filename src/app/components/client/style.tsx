import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  flex: 1;
  padding-top: 100px; // Nav 높이
  min-height: calc(100vh - 150px);

  @media (max-width: 768px) {
    padding-top: 72px; // 모바일에서 Nav를 더 얇게 사용 시
    min-height: calc(100vh - 120px);
    padding-bottom: 72px; // bottom tabbar spacing
  }
`;
