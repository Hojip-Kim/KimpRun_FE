import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  color: #e0e0e0;
  height: 100%;
  overflow-y: auto;
  background-color: #131722;
  border-radius: 8px;
  font-size: 0.7rem;
  border: 2px solid rgba(123, 123, 123, 0.4);
  padding: 5px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
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
  color: #4a90e2;
  margin-top: 10px;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

export const MessageContainer = styled.div<{
  authenticated: string;
  $isSelf: boolean;
}>`
  color: ${(props) => (props.authenticated === 'true' ? '#4a90e2' : '#e0e0e0')};
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
  justify-content: ${(props) => (props.$isSelf ? 'flex-end' : 'flex-start')};

  & > div {
    display: flex;
    align-items: center;
    flex-direction: ${(props) => (props.$isSelf ? 'row' : 'row-reverse')};
    max-width: 80%;
  }
`;

export const MessageContent = styled.span`
  background-color: #2c2c2c;
  padding: 5px 10px;
  border-radius: 10px;
`;

export const ChatForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

export const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #e0e0e0;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #3a7bc8;
  }
`;

// 새로운 연결 상태 표시 컴포넌트
export const ConnectionStatus = styled.div<{ status: string }>`
  padding: 5px;
  text-align: center;
  font-size: 0.7rem;
  color: ${(props) => (props.status === 'connected' ? '#4caf50' : '#f44336')};
  background-color: ${(props) =>
    props.status === 'connected'
      ? 'rgba(76, 175, 80, 0.1)'
      : 'rgba(244, 67, 54, 0.1)'};
  border-radius: 4px;
  margin-bottom: 5px;
`;
