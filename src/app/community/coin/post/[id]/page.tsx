'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BoardData } from './types';
import { getBoardData } from './lib/api';
import PostContent from './PostContent';
import CommentSection from './CommentSection';
import { Container, ScrollableCommentSection } from './style';
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
