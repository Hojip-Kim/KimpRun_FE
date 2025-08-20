import { palette } from '@/styles/palette';
import styled from 'styled-components';

export const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${palette.card};
  border-radius: 8px;
  /* Allow popovers/menus (e.g., Dropdown) to escape clipping */
  overflow: visible;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 30, 30, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);

  div {
    background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    color: #e0e0e0;
    padding: 20px 40px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border: 1px solid #444444;

    &::before {
      content: '⏳ ';
      margin-right: 8px;
    }
  }
`;

export const MobileChartContainer = styled.div`
  display: none;
  @media (max-width: 992px) {
    display: block;
    margin: 8px 0 12px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    overflow: hidden;
    background: #131722;
    height: 200px;
    position: sticky;
    top: 76px; /* below mobile nav */
    z-index: 2;
    #mobile-chart {
      height: 100%;
      width: 100%;
    }
  }
`;
