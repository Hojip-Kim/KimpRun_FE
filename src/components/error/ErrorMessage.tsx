'use client';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: 1rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const MessageCard = styled.div`
  background-color: #1f2937;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #374151;
`;

const Message = styled.p`
  color: #e5e7eb;
  font-size: 1.125rem;
`;

interface ErrorMessageProps {
  title: string;
  message: string;
}

export default function ErrorMessage({ title, message }: ErrorMessageProps) {
  return (
    <Container>
      <Title>{title}</Title>
      <MessageCard>
        <Message>{message}</Message>
      </MessageCard>
    </Container>
  );
}
