import styled from "styled-components";
import { palette } from '@/styles/palette';

export const MarketSelectorContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 16px;
  padding: 14px;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: ${palette.shadow};
  backdrop-filter: blur(6px);
  position: relative; /* create stacking context above sticky chart */
  z-index: 10;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 8px;
    padding: 8px;
  }
`;

export const MarketSelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
  position: relative;
`;

export const MarketSelectorLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: ${palette.textSecondary};
  margin-bottom: 6px;
  letter-spacing: 0.2px;
`;
 
