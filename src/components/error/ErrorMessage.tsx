'use client';
import { Container, Title, MessageCard, Message } from './style';

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
