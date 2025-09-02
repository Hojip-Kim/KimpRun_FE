import React from 'react';
import { Post } from '../types';
import Link from 'next/link';
import ProfileImage from '@/components/common/ProfileImage';
import {
  StyledRow,
  TitleSection,
  NumberCell,
  CategoryCell,
  CategoryTag,
  TitleCell,
  Title,
  AuthorCell,
  AuthorLink,
  DateCell,
  StatsSection,
  StatValue,
  MobileRowHeader,
  MobileRowContent,
  MobileStats,
  MobileStat,
  NoticeTag,
  TitleWithNotice,
} from './style';

interface BoardRowProps {
  post: Post;
}

const BoardRow: React.FC<BoardRowProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleAuthorClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open(`/profile/${post.memberId}`, '_blank');
  };

  return (
    <Link href={`/community/coin/post/${post.boardId}`}>
      <StyledRow isNotice={post.isPin}>
        {/* 데스크톱 레이아웃 */}
        <TitleSection>
          <NumberCell>{post.boardId}</NumberCell>
          <CategoryCell>
            <CategoryTag isNotice={post.isPin}>{post.categoryName}</CategoryTag>
          </CategoryCell>
          <TitleCell>
            <TitleWithNotice>
              <Title isNotice={post.isPin}>{post.title}</Title>
              {post.isPin && <NoticeTag>공지</NoticeTag>}
            </TitleWithNotice>
          </TitleCell>
          <AuthorCell>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              <ProfileImage
                src={post.profileImageUrl}
                alt={post.memberNickName}
                size={24}
                onClick={handleAuthorClick}
              />
              <AuthorLink onClick={handleAuthorClick}>
                {post.memberNickName}
              </AuthorLink>
            </div>
          </AuthorCell>
          <DateCell>{formatDate(post.createdAt)}</DateCell>
        </TitleSection>

        <StatsSection>
          <StatValue>{post.boardViewsCount}</StatValue>
          <StatValue>{post.boardLikesCount}</StatValue>
          <StatValue>{post.commentsCount}</StatValue>
        </StatsSection>

        {/* 모바일 레이아웃 - 데스크톱에서는 숨김 */}
        <MobileRowHeader>
          <CategoryTag isNotice={post.isPin}>{post.categoryName}</CategoryTag>
          {post.isPin && <NoticeTag>공지</NoticeTag>}
        </MobileRowHeader>

        <MobileRowContent>
          <div>
            <Title isNotice={post.isPin}>{post.title}</Title>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ProfileImage
                  src={post.profileImageUrl}
                  alt={post.memberNickName}
                  size={20}
                  onClick={handleAuthorClick}
                />
                <AuthorLink onClick={handleAuthorClick}>
                  {post.memberNickName}
                </AuthorLink>
              </div>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          <MobileStats>
            <MobileStat>
              👀 <strong>{post.boardViewsCount}</strong>
            </MobileStat>
            <MobileStat>
              👍 <strong>{post.boardLikesCount}</strong>
            </MobileStat>
            <MobileStat>
              💬 <strong>{post.commentsCount}</strong>
            </MobileStat>
          </MobileStats>
        </MobileRowContent>
      </StyledRow>
    </Link>
  );
};

export default BoardRow;
