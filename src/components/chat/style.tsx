import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: #e6e8ee;
  height: 100%;
  overflow-y: auto;
  background: rgba(20, 24, 34, 0.9);
  border-radius: 12px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #4a4a4a 0%, #666666 100%);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ChatBox = styled.div``;

export const FetchButton = styled.div`
  cursor: pointer;
  color: #ffd700;
  margin-top: 10px;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

export const MessageContainer = styled.div<{
  authenticated: boolean;
  $isSelf: boolean;
}>`
  display: flex;
  justify-content: ${(props) => (props.$isSelf ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  margin-bottom: 6px;
  width: 100%;
`;

export const MessageBubble = styled.div<{
  authenticated: boolean;
  $isSelf: boolean;
}>`
  max-width: 60%;
  display: flex;
  flex-direction: column;
`;

export const MessageHeader = styled.div<{
  $isSelf: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$isSelf ? 'flex-end' : 'flex-start')};
  margin-bottom: 2px;
  gap: 4px;
`;

export const UserName = styled.span<{
  authenticated: boolean;
  $isSelf: boolean;
}>`
  font-size: 0.65rem;
  font-weight: 600;
  color: ${(props) => {
    if (props.$isSelf) return '#cfd6e4';
    if (props.authenticated) return '#ffd700';
    return '#9aa6bf';
  }};
`;

export const MessageTime = styled.span`
  font-size: 0.55rem;
  color: #7b87a3;
  margin-top: 0;
`;


export const MessageContent = styled.div<{
  $isSelf: boolean;
}>`
  background: ${(props) =>
    props.$isSelf ? 'linear-gradient(180deg, #2b3242, #202635)' : 'rgba(8,12,20,0.9)'};
  color: #e6e8ee;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  max-width: 100%;
  font-size: 0.75rem;
  line-height: 1.3;
  position: relative;
  display: inline-block;
  width: fit-content;

  ${(props) => props.$isSelf ? `
    border-bottom-right-radius: 3px;
  ` : `
    border-bottom-left-radius: 3px;
  `}
`;

export const MessageTimeSide = styled.span<{ $isSelf: boolean }>`
  font-size: 0.6rem;
  color: #7b87a3;
  margin: 0 6px;
  white-space: nowrap;
  align-self: flex-end;
`;

export const ChatForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

export const ChatInput = styled.input<{ $warning?: boolean }>`
  flex-grow: 1;
  padding: 12px 14px;
  border: 1px solid
    ${(props) =>
      props.$warning ? 'rgba(244, 67, 54, 0.45)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 12px;
  background-color: ${(props) =>
    props.$warning ? 'rgba(244, 67, 54, 0.1)' : 'rgba(8, 12, 20, 0.9)'};
  color: #e6e8ee;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: rgba(255, 215, 0, 0.45);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  &::placeholder {
    color: #7b87a3;
  }
`;

export const SendButton = styled.button`
  padding: 12px 16px;
  margin-left: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: linear-gradient(180deg, #1e1e1e, #171b24);
  color: #e6e8ee;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: #ffd700;
    background-color: #131722;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 새로운 연결 상태 표시 컴포넌트
export const ConnectionStatus = styled.div<{ status: string }>`
  padding: 8px 12px;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${(props) => (props.status === 'connected' ? '#c9f7c5' : '#ffc9c9')};
  background: ${(props) =>
    props.status === 'connected'
      ? 'linear-gradient(90deg, rgba(46, 125, 50, 0.18) 0%, rgba(46, 125, 50, 0.08) 100%)'
      : 'linear-gradient(90deg, rgba(183, 28, 28, 0.18) 0%, rgba(183, 28, 28, 0.08) 100%)'};
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;
