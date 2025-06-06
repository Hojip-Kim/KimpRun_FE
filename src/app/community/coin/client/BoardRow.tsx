import React from 'react';
import { Post } from '../types';
import Link from 'next/link';
import { StyledRow, TitleSection, NumberCell, CategoryCell, CategoryTag, TitleCell, Title, AuthorCell, DateCell, StatsSection, StatValue } from './style';

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

export default BoardRow;
