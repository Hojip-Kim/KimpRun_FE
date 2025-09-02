import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${palette.textPrimary};
  height: 100%;
  background: ${palette.card};
  border-radius: 12px;
  font-size: 0.75rem;
  border: 1px solid ${palette.border};
  padding: 12px;
  box-shadow: ${palette.shadow};
`;

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ChatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0; /* flex 항목이 축소될 수 있도록 함 */
  height: 0; /* flex: 1과 함께 사용하여 정확한 높이 계산 */
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.textMuted};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${palette.input};
  }
`;

export const FetchButton = styled.div`
  cursor: pointer;
  color: ${palette.accent};
  margin-top: 10px;
  margin-bottom: 20px;
  &:hover {
    text-decoration: underline;
  }
`;

export const MessageContainer = styled.div<{
  $authenticated: boolean;
  $isSelf: boolean;
}>`
  display: flex;
  justify-content: ${(props) => (props.$isSelf ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  margin-bottom: 6px;
  width: 100%;
  position: relative;
`;

export const MessageBubble = styled.div<{
  $authenticated: boolean;
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
  justify-content: flex-start;
  margin-bottom: 4px;
  gap: 6px;
`;

export const UserName = styled.span<{
  $authenticated: boolean;
  $isSelf: boolean;
}>`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${(props) => {
    if (props.$authenticated) return palette.accent;
    return palette.textSecondary;
  }};
  cursor: pointer;
  position: relative;

  &:hover {
    text-decoration: underline;
  }
`;

export const UserDropdown = styled.div<{ $show: boolean }>`
  position: fixed;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 9999;
  min-width: 80px;
  display: ${(props) => (props.$show ? 'block' : 'none')};
  overflow: hidden;
`;

export const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.7rem;
  color: ${palette.textPrimary};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${palette.input};
  }

  &.report {
    color: #f59e0b;
  }

  &.block {
    color: #ef4444;
  }

  &.profile {
    color: ${palette.accent};
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${palette.textMuted};
  font-size: 0.6rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  opacity: 0.7;
  transition: all 0.2s ease;
  margin-left: 4px;
  align-self: flex-end;
  margin-bottom: 2px;

  &:hover {
    opacity: 1;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;

export const MessageTime = styled.span`
  font-size: 0.6rem;
  color: ${palette.textMuted};
  opacity: 0.8;
`;

export const MessageContent = styled.div<{
  $isSelf: boolean;
}>`
  background: ${(props) => (props.$isSelf ? palette.accent : palette.card)};
  color: ${(props) => (props.$isSelf ? palette.bgPage : palette.textPrimary)};
  border: 1px solid
    ${(props) => (props.$isSelf ? palette.accent : palette.border)};
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  max-width: 100%;
  font-size: 0.75rem;
  line-height: 1.3;
  position: relative;
  display: inline-block;
  width: fit-content;
  box-shadow: ${(props) =>
    props.$isSelf ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};

  ${(props) =>
    props.$isSelf
      ? `
    border-bottom-right-radius: 4px;
  `
      : `
    border-bottom-left-radius: 4px;
  `}
`;

export const MessageTimeSide = styled.span<{ $isSelf: boolean }>`
  font-size: 0.55rem;
  color: ${palette.textMuted};
  margin: ${(props) => (props.$isSelf ? '0 8px 0 6px' : '0 6px 0 8px')};
  white-space: nowrap;
  align-self: flex-end;
  margin-bottom: 4px;
  order: ${(props) => (props.$isSelf ? -1 : 1)};
`;

export const ChatForm = styled.form`
  display: flex;
  margin-top: 10px;
`;

export const ChatInput = styled.input<{ $warning?: boolean }>`
  flex-grow: 1;
  padding: 12px 14px;
  border: 1px solid
    ${(props) => (props.$warning ? 'rgba(244, 67, 54, 0.45)' : palette.border)};
  border-radius: 12px;
  background-color: ${(props) =>
    props.$warning ? 'rgba(244, 67, 54, 0.1)' : palette.input};
  color: ${palette.textPrimary};
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }

  &::placeholder {
    color: ${palette.textMuted};
  }
`;

export const SendButton = styled.button`
  padding: 12px 16px;
  margin-left: 8px;
  border: 1px solid ${palette.border};
  border-radius: 12px;
  background: ${palette.input};
  color: ${palette.textPrimary};
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: ${palette.accent};
    background-color: ${palette.input};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
`;

export const UnblockAllButton = styled.button`
  background: transparent;
  color: #f44336;
  border: 1px solid #f44336;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #f44336;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
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
  border: 1px solid ${palette.border};
  flex: 1;
`;

// 신고 모달 스타일
export const ReportModal = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

export const ReportModalContent = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

export const ReportModalTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${palette.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
`;

export const ReportTextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${palette.border};
  border-radius: 8px;
  background: ${palette.input};
  color: ${palette.textPrimary};
  font-size: 0.9rem;
  resize: vertical;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }

  &::placeholder {
    color: ${palette.textMuted};
  }
`;

export const ReportModalButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: flex-end;
`;

export const ReportModalButton = styled.button<{
  $variant?: 'primary' | 'secondary';
}>`
  padding: 10px 16px;
  border: 1px solid
    ${(props) =>
      props.$variant === 'primary' ? palette.accent : palette.border};
  border-radius: 8px;
  background: ${(props) =>
    props.$variant === 'primary' ? palette.accent : palette.input};
  color: ${(props) =>
    props.$variant === 'primary' ? palette.bgPage : palette.textPrimary};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ReportCharCount = styled.div`
  text-align: right;
  margin-top: 4px;
  font-size: 0.75rem;
  color: ${palette.textMuted};
`;
