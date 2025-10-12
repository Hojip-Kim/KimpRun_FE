'use client';

import React from 'react';
import PostContent from './PostContent';
import CommentSection from './CommentSection';
import { Container, ScrollableCommentSection } from './style';
import { BoardData } from './types';
import { useBoardData } from './hooks/useBoardData';
import { CommunityPostSkeleton } from '@/components/skeleton/Skeleton';

interface ClientPostPageProps {
  boardData: BoardData;
}

const ClientPostPage: React.FC<ClientPostPageProps> = ({
  boardData: initialBoardData,
}) => {
  const boardId = initialBoardData.boardId.toString();

  // React Query로 데이터 관리
  const {
    data: boardData,
    isLoading,
    error,
    refetch,
  } = useBoardData(boardId, initialBoardData);

  if (isLoading) {
    return <CommunityPostSkeleton />;
  }

  if (error || !boardData) {
    return (
      <Container>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>게시글을 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => refetch()}
            style={{
              padding: '0.5rem 1rem',
              marginTop: '1rem',
              backgroundColor: '#ffd700',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PostContent
        boardData={boardData}
        onPostUpdate={() => {
          // 수정 후 데이터 새로고침
          refetch();
        }}
      />
      <ScrollableCommentSection>
        <CommentSection
          boardId={boardData.boardId}
          initialComments={boardData.comments}
          postAuthorId={boardData.memberId}
        />
      </ScrollableCommentSection>
    </Container>
  );
};

export default ClientPostPage;
