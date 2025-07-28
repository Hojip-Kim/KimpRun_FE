import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  flex: 1;
  padding-top: 100px; // Nav의 높이와 동일하게 설정
  min-height: calc(100vh - 150px); // 전체 높이에서 Nav 높이를 뺀 만큼
`;