import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: 1rem;
`;

export const Title = styled.h1`
  color: ${palette.textPrimary};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const MessageCard = styled.div`
  background: ${palette.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
`;

export const Message = styled.p`
  color: ${palette.textSecondary};
  font-size: 1.125rem;
`;
