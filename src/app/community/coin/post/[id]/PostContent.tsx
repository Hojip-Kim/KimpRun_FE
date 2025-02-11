'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { BoardData } from './types';
import { formatDate } from './lib/api';
import { FaEye, FaHeart } from 'react-icons/fa';

const PostContent: React.FC<{ boardData: BoardData }> = ({ boardData }) => {
  const [likesCount, setLikesCount] = useState(boardData.boardLikesCount);

  const boardUrl = process.env.NEXT_PUBLIC_BOARD_URL;

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

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  word-break: keep-all;
  color: #ffd700;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #aaa;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #444;
  margin-right: 0.5rem;
`;

const AuthorName = styled.span`
  font-weight: 600;
  color: #e0e0e0;
  margin-right: 0.5rem;
`;

const PostDate = styled.span`
  color: #888;
`;

const StatsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  color: #888;

  svg {
    margin-right: 0.3rem;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #ffd700;
  }
`;
const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  word-break: keep-all;
  overflow-wrap: break-word;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    color: #ffd700;
  }

  h1 {
    font-size: 1.6rem;
  }
  h2 {
    font-size: 1.4rem;
  }
  h3 {
    font-size: 1.2rem;
  }
  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1em;
  }

  ul,
  ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }

  code {
    background-color: #444;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    color: #ffd700;
  }

  pre {
    background-color: #444;
    padding: 1em;
    overflow-x: auto;
    border-radius: 3px;
  }

  blockquote {
    border-left: 4px solid #ffd700;
    padding-left: 1em;
    color: #aaa;
  }

  a {
    color: #ffd700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
