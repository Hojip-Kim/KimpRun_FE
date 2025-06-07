import styled from 'styled-components';
import { MarketType } from '@/types/marketType';

export const NoticeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 8px;
  border: 1px solid #333333;
  overflow: hidden;
`;

export const NoticeHeader = styled.div`
  padding: 15px 20px;
  background-color: #2c2c2c;
  border-bottom: 1px solid #333333;
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NoticeTitle = styled.h3`
  color: #ffd700;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '📢';
    font-size: 1.1rem;
  }
`;

export const NoticeList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const NoticeItem = styled.div`
  background-color: #131722;
  border: 1px solid #333333;
  border-radius: 6px;
  margin-bottom: 8px;
  padding: 12px 15px;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #1a1a2e;
    border-color: #ffd700;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const NoticeItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ExchangeBadge = styled.span<{ exchangeType: MarketType }>`
  background-color: ${({ exchangeType }) => {
    switch (exchangeType) {
      case MarketType.UPBIT:
        return '#0066cc';
      case MarketType.BINANCE:
        return '#f0b90b';
      case MarketType.COINONE:
        return '#00d4aa';
      case MarketType.BITHUMB:
        return '#ff6b35';
      default:
        return '#666666';
    }
  }};
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  text-transform: uppercase;
`;

export const NoticeDate = styled.span`
  color: #888888;
  font-size: 0.7rem;
  font-weight: 400;
`;

export const NoticeItemTitle = styled.h4`
  color: #e0e0e0;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #ffd700;
  }
`;

export const NoticeUrl = styled.a`
  color: #4a9eff;
  font-size: 0.7rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0.8;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    color: #66b3ff;
    text-decoration: underline;
  }

  &::after {
    content: '↗';
    font-size: 0.6rem;
  }
`;

export const EmptyNotice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666666;
  font-size: 0.9rem;
  text-align: center;

  &::before {
    content: '📭';
    font-size: 2rem;
    margin-bottom: 10px;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: #ffd700;
  font-size: 0.9rem;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid #333333;
    border-top: 2px solid #ffd700;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 10px;
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

export const ErrorContainer = styled.div`
  background-color: #2c1810;
  border: 1px solid #ff6b6b;
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  text-align: center;
`;

export const ErrorTitle = styled.h3`
  color: #ff6b6b;
  font-size: 1rem;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &::before {
    content: '⚠️';
    font-size: 1.1rem;
  }
`;

export const ErrorMessage = styled.p`
  color: #e0e0e0;
  font-size: 0.8rem;
  margin: 5px 0;
  opacity: 0.8;
`;

export const RetryButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ff5252;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ExchangeSelector = styled.select`
  background-color: #131722;
  color: #e0e0e0;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffd700;
  }

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }

  option {
    background-color: #131722;
    color: #e0e0e0;
    padding: 8px;
  }
`;
