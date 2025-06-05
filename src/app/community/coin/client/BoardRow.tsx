import React from 'react';
import { Post } from '../types';
import styled from 'styled-components';
import Link from 'next/link';

interface BoardRowProps {
  post: Post;
}

const BoardRow: React.FC<BoardRowProps> = ({ post }) => {
  return (
    <StyledRow>
      <TitleSection>
        <NumberCell>{post.boardId}</NumberCell>
        <CategoryCell>
          <CategoryTag>{post.categoryName}</CategoryTag>
        </CategoryCell>
        <TitleCell>
          <Link href={`/community/coin/post/${post.boardId}`}>
            <Title>{post.title}</Title>
          </Link>
        </TitleCell>
        <AuthorCell>{post.memberNickName}</AuthorCell>
        <DateCell>
          {' '}
          {new Date(post.createdAt).toLocaleString('ko-KR', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </DateCell>
      </TitleSection>

      <StatsSection>
        <StatValue>{post.boardViewsCount}</StatValue>
        <StatValue>{post.boardLikesCount}</StatValue>
        <StatValue>{post.commentsCount}</StatValue>
      </StatsSection>
    </StyledRow>
  );
};
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const CategoryTag = styled.span`
  display: inline-block;
  border: 1px solid #444;
  color: #e0e0e0;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 300;
  background-color: transparent;
`;

const StyledRow = styled.div`
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #444;

  &:last-child {
    border-bottom: none;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #ffd700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const StatValue = styled.div`
  width: 60px;
  text-align: center;
  font-size: 14px;
  color: #e0e0e0;
`;

const TitleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const StatsSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const NumberCell = styled.div`
  width: 60px;
`;

const AuthorCell = styled.div`
  width: 100px;
  text-align: center;
`;

const DateCell = styled.div`
  width: 150px;
  text-align: center;
`;

const CategoryCell = styled.div`
  width: 100px;
  text-align: center;
  color: #e0e0e0;
`;

const TitleCell = styled.div`
  flex: 1;
  padding: 0 16px;
`;

export default BoardRow;
