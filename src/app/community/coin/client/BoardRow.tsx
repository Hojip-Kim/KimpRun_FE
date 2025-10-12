import React from 'react';
import { Post } from '../types';
import Link from 'next/link';
import ProfileImage from '@/components/common/ProfileImage';
import { formatKoreanDateTime } from '@/utils/dateUtils';
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

  const handleAuthorClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.open(`/profile/${post.memberId}`, '_blank');
  };

  return (
    <Link 
      href={`/community/coin/post/${post.boardId}`}
      style={{ textDecoration: 'none' }}
    >
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
          <DateCell>{formatKoreanDateTime(post.createdAt)}</DateCell>
        </TitleSection>

        <StatsSection>
          <StatValue>{post.boardViewsCount}</StatValue>
          <StatValue>{post.boardLikesCount}</StatValue>
          <StatValue>{post.commentsCount}</StatValue>
        </StatsSection>

        {/* 모바일 레이아웃 - 데스크톱에서는 숨김 */}
        <MobileRowHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CategoryTag isNotice={post.isPin}>{post.categoryName}</CategoryTag>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ProfileImage
                src={post.profileImageUrl}
                alt={post.memberNickName}
                size={16}
                onClick={handleAuthorClick}
              />
              <AuthorLink onClick={handleAuthorClick}>
                {post.memberNickName}
              </AuthorLink>
            </div>
          </div>
          {post.isPin && <NoticeTag>공지</NoticeTag>}
        </MobileRowHeader>

        <MobileRowContent>
          <Title isNotice={post.isPin}>{post.title}</Title>
          
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.3rem',
            }}
          >
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
              {formatKoreanDateTime(post.createdAt)}
            </span>
            
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
          </div>
        </MobileRowContent>
      </StyledRow>
    </Link>
  );
};

export default BoardRow;
