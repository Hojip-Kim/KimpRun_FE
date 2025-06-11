import styled from 'styled-components';

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

export const ExchangeBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'exchangeType',
})<{ exchangeType: string }>`
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
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
  gap: 10px;
`;

export const ExchangeSelector = styled.select`
  padding: 8px 12px;
  border: 1px solid #333;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: #555;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const InfiniteScrollContainer = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  color: #ffd700;
  font-size: 14px;
`;

export const LoadingText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffd700;
  font-size: 14px;
`;

export const NoticeLoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-top: 2px solid #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

export const NewNoticeContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const AnimatedNoticeList = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSliding',
})<{ isSliding: boolean }>`
  transition: transform 0.5s ease-in-out;
  transform: ${(props) =>
    props.isSliding ? 'translateY(20px)' : 'translateY(0)'};
`;

export const NewNoticeItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isAnimating'].includes(prop),
})<{ isAnimating?: boolean }>`
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #ffffff;

  ${(props) =>
    props.isAnimating &&
    `
    animation: slideInFromTop 0.5s ease-out;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    background: #2a2a2a;
  }

  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const NewBadge = styled.span`
  display: inline-block;
  background: linear-gradient(45deg, #ffd700, #ff8e8e);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 8px;
  margin-left: 8px;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 107, 107, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
    }
  }
`;

export const ModalOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  transition: all 0.3s ease-in-out;
`;

export const NoticeModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  max-width: 90vw;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border: 1px solid #ffd700;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transform: ${(props) =>
    props.isVisible ? 'translateX(0)' : 'translateX(calc(100% + 60px))'};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1001;

  /* 초기 상태에서 완전히 숨김 */
  ${(props) =>
    !props.isVisible &&
    `
    visibility: hidden;
  `}
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
`;

export const ModalTitle = styled.h3`
  color: #ffd700;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🔔';
    font-size: 18px;
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

export const ModalContent = styled.div`
  color: #e0e0e0;
`;

export const ModalExchangeBadge = styled.div<{ exchangeType: number }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
  background: ${(props) => {
    switch (props.exchangeType) {
      case 3:
        return 'linear-gradient(45deg, #1976d2, #42a5f5)'; // UPBIT
      case 2:
        return 'linear-gradient(45deg, #f57c00, #ffb74d)'; // BINANCE
      case 4:
        return 'linear-gradient(45deg, #388e3c, #66bb6a)'; // COINONE
      case 5:
        return 'linear-gradient(45deg, #d32f2f, #ef5350)'; // BITHUMB
      default:
        return 'linear-gradient(45deg, #616161, #9e9e9e)'; // ALL
    }
  }};
  color: white;
`;

export const ModalNoticeTitle = styled.h4`
  color: #fff;
  font-size: 14px;
  margin: 10px 0;
  line-height: 1.4;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #333;
`;

export const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #000;
    font-weight: bold;
    
    &:hover {
      background: linear-gradient(45deg, #ffed4e, #fff176);
      transform: translateY(-1px);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.1);
    color: #e0e0e0;
    border: 1px solid #333;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: #555;
    }
  `}
`;

export const ModalAutoCloseTimer = styled.div`
  margin-top: 10px;
  text-align: center;
  color: #888;
  font-size: 12px;
`;

export const TimerBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 3px;
  background: #333;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => props.progress}%;
    height: 100%;
    background: linear-gradient(90deg, #ffd700, #ffed4e);
    transition: width 0.1s linear;
    border-radius: 2px;
  }
`;

export const NoticeModalContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  pointer-events: none;

  > * {
    pointer-events: auto;
    margin-bottom: 15px;
  }
`;

export const NoticeItemHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
