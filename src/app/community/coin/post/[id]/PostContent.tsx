'use client';

import React, { useState } from 'react';
import { BoardData } from './types';
import { formatDate } from './lib/api';
import { FaEye, FaHeart } from 'react-icons/fa';
import { serverEnv } from '@/utils/env';
import {
  Title,
  MetaInfo,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  PostDate,
  StatsContainer,
  Stat,
  LikeButton,
  Content,
} from './style';

const PostContent: React.FC<{ boardData: BoardData }> = ({ boardData }) => {
  const [likesCount, setLikesCount] = useState(boardData.boardLikesCount);

  const boardUrl = serverEnv.BOARD_URL;

  const handleLike = async () => {
    try {
      const response = await fetch(`${boardUrl}/like`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardData.boardId),
      });
      if (response.ok) {
        setLikesCount((prevCount) => prevCount + 1);
        alert('좋아요 처리 완료');
      } else {
        alert('이미 좋아요를 했습니다.');
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
    }
  };

  return (
    <>
      <Title>{boardData.title}</Title>
      <MetaInfo>
        <AuthorInfo>
          <AuthorAvatar />
          <AuthorName>{boardData.userNickName}</AuthorName>
        </AuthorInfo>
        <PostDate>{formatDate(boardData.createdAt)}</PostDate>
        <StatsContainer>
          <Stat>
            <FaEye /> {boardData.boardViewsCount}
          </Stat>
          <Stat>
            <LikeButton onClick={handleLike}>
              <FaHeart /> {likesCount}
            </LikeButton>
          </Stat>
        </StatsContainer>
      </MetaInfo>
      <Content dangerouslySetInnerHTML={{ __html: boardData.content }} />
    </>
  );
};

export default PostContent;
