'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoardData } from './types';
import { getBoardData } from './lib/api';
import PostContent from './PostContent';
import CommentSection from './CommentSection';

const Page = () => {
  const { id } = useParams();
  const [boardData, setBoardData] = useState<BoardData | null>(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (typeof id === 'string') {
        const data = await getBoardData(id);
        setBoardData(data);
      }
    };
    fetchBoardData();
  }, [id]);

  if (!boardData) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <PostContent boardData={boardData} />
      <ScrollableCommentSection>
        <CommentSection
          boardId={boardData.boardId}
          initialComments={boardData.comments}
        />
      </ScrollableCommentSection>
    </Container>
  );
};

export default Page;

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  background-color: #2c2c2c;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  color: #e0e0e0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(21, 21, 21);
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  @media (min-width: 800px) {
    height: calc(100vh - 8rem);
    margin: 1rem auto;
    border-radius: 12px;
  }
`;

const ScrollableCommentSection = styled.div`
  margin-top: 1rem;
`;
