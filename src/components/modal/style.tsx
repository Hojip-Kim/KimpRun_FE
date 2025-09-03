import styled from 'styled-components';
import { palette } from '@/styles/palette';
export const Container = styled.div<{ width: number; height: number }>`
  position: fixed !important;
  display: flex !important;
  flex-direction: column !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: ${(props) => props.width}px !important;
  height: ${(props) => props.height}px !important;
  padding: 8px !important;
  background: ${palette.card} !important;
  border: 1px solid ${palette.border} !important;
  border-radius: 12px !important;
  z-index: 9999 !important;
  box-shadow: ${palette.shadow} !important;
  color: ${palette.textPrimary} !important;
  margin: 0 !important;

  .exit-wrapper {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 14px;
    font-weight: 800;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Canvas = styled.div`
  position: fixed !important;
  inset: 0 !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
  z-index: 9998 !important;
  margin: 0 !important;
  padding: 0 !important;
`;

export const Wrapper = styled.div`
  background-color: transparent;
`;
