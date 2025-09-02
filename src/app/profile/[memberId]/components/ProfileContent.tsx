import React from 'react';
import Link from 'next/link';
import {
  ProfileTab,
  UserPost,
  UserComment,
  FollowerInfo,
  FollowingInfo,
} from '@/types/profile';
import { PageResponse } from '@/types/page';
import Pagination from '@/components/common/Pagination';
import {
  ContentContainer,
  ContentWrapper,
  ContentHeader,
  HeaderTitle,
  HeaderMeta,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
  PostItem,
  PostHeader,
  PostCategory,
  PostMeta,
  PostTitle,
  PostContent,
  PostStats,
  CommentTargetPost,
  CommentTargetTitle,
  CommentTargetLink,
  FollowItem,
  FollowAvatar,
  FollowInfo,
  FollowName,
  FollowDate,
} from '../styles';
import { ProfileFollowSkeleton } from '@/components/skeleton/Skeleton';
import SkeletonBase from '@/components/skeleton/Skeleton';

interface ProfileContentProps {
  currentTab: ProfileTab;
  data: PageResponse<
    UserPost | UserComment | FollowerInfo | FollowingInfo
  > | null;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  memberId: number;
  isOwnProfile: boolean;
}

export default function ProfileContent({
  currentTab,
  data,
  isLoading,
  currentPage,
  onPageChange,
  memberId,
  isOwnProfile,
}: ProfileContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPosts = (posts: UserPost[]) => {
    return (
      <>
        <ContentHeader>
          <HeaderTitle>게시물 목록</HeaderTitle>
          <HeaderMeta>총 {posts.length}개의 게시물</HeaderMeta>
        </ContentHeader>
        {posts.map((post) => (
          <PostItem key={post.boardId}>
            <PostHeader>
              <PostCategory>{post.categoryName}</PostCategory>
              <PostMeta>
                <span>{formatDateTime(post.createdAt)}</span>
                {post.isPin && <span>📌 고정</span>}
              </PostMeta>
            </PostHeader>

            <Link href={`/community/coin/post/${post.boardId}`}>
              <PostTitle>{post.title}</PostTitle>
            </Link>

            <PostStats>
              <span>👀 {post.boardViewsCount}</span>
              <span>❤️ {post.boardLikesCount}</span>
              <span>💬 {post.commentsCount}</span>
            </PostStats>
          </PostItem>
        ))}
      </>
    );
  };

  const renderComments = (comments: UserComment[]) => {
    return (
      <>
        <ContentHeader>
          <HeaderTitle>댓글 목록</HeaderTitle>
          <HeaderMeta>총 {comments.length}개의 댓글</HeaderMeta>
        </ContentHeader>
        {comments.map((comment) => (
          <PostItem key={comment.id}>
            <CommentTargetPost>
              <CommentTargetTitle>댓글 대상 게시물</CommentTargetTitle>
              <CommentTargetLink
                href={`/community/coin/post/${comment.boardId}`}
              >
                {comment.boardTitle}
              </CommentTargetLink>
            </CommentTargetPost>

            <PostHeader>
              <PostMeta>
                <span>{formatDateTime(comment.createdAt)}</span>
                <span>❤️ {comment.likes}</span>
              </PostMeta>
            </PostHeader>

            <PostContent style={{ marginBottom: 0 }}>
              {comment.content}
            </PostContent>
          </PostItem>
        ))}
      </>
    );
  };

  const renderFollowers = (followers: FollowerInfo[]) => {
    return (
      <>
        <ContentHeader>
          <HeaderTitle>팔로워 목록</HeaderTitle>
          <HeaderMeta>총 {followers.length}명의 팔로워</HeaderMeta>
        </ContentHeader>
        {followers.map((follower) => (
          <FollowItem key={follower.memberId}>
            <FollowAvatar>
              {follower.profileImageUrl ? (
                <img src={follower.profileImageUrl} alt={follower.nickname} />
              ) : (
                follower.nickname.charAt(0).toUpperCase()
              )}
            </FollowAvatar>

            <FollowInfo>
              <Link href={`/profile/${follower.memberId}`}>
                <FollowName>{follower.nickname}</FollowName>
              </Link>
              <FollowDate>
                {formatDate(follower.followedAt)} 부터 팔로우
              </FollowDate>
            </FollowInfo>
          </FollowItem>
        ))}
      </>
    );
  };

  const renderFollowing = (following: FollowingInfo[]) => {
    return (
      <>
        <ContentHeader>
          <HeaderTitle>팔로잉 목록</HeaderTitle>
          <HeaderMeta>총 {following.length}명 팔로우 중</HeaderMeta>
        </ContentHeader>
        {following.map((follow) => (
          <FollowItem key={follow.memberId}>
            <FollowAvatar>
              {follow.profileImageUrl ? (
                <img src={follow.profileImageUrl} alt={follow.nickname} />
              ) : (
                follow.nickname.charAt(0).toUpperCase()
              )}
            </FollowAvatar>

            <FollowInfo>
              <Link href={`/profile/${follow.memberId}`}>
                <FollowName>{follow.nickname}</FollowName>
              </Link>
              <FollowDate>
                {formatDate(follow.followedAt)} 부터 팔로우
              </FollowDate>
            </FollowInfo>
          </FollowItem>
        ))}
      </>
    );
  };

  const getEmptyMessage = () => {
    switch (currentTab) {
      case 'posts':
        return '작성한 게시물이 없습니다.';
      case 'comments':
        return '작성한 댓글이 없습니다.';
      case 'followers':
        return '팔로워가 없습니다.';
      case 'following':
        return '팔로우 중인 사용자가 없습니다.';
      default:
        return '데이터가 없습니다.';
    }
  };

  const getEmptyIcon = () => {
    switch (currentTab) {
      case 'posts':
        return '📝';
      case 'comments':
        return '💬';
      case 'followers':
      case 'following':
        return '👥';
      default:
        return '📭';
    }
  };

  if (isLoading) {
    return (
      <ContentContainer>
        <ContentWrapper>
          {/* 헤더 스켈레톤 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              background: 'var(--input)',
              border: '1px solid var(--border-soft)',
              borderRadius: '8px',
            }}
          >
            <SkeletonBase $width="120px" $height={16} $radius={4} />
            <SkeletonBase $width="80px" $height={12} $radius={4} />
          </div>

          {/* 컨텐츠 아이템 스켈레톤 */}
          {currentTab === 'followers' || currentTab === 'following'
            ? // 팔로우 목록 스켈레톤
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    margin: '0.5rem 0',
                    background: 'var(--input)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '12px',
                  }}
                >
                  <SkeletonBase $width="40px" $height={40} $radius={50} />
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <SkeletonBase $width="100px" $height={16} $radius={4} />
                    <SkeletonBase $width="140px" $height={12} $radius={4} />
                  </div>
                </div>
              ))
            : // 게시물/댓글 목록 스켈레톤
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem',
                    margin: '0.5rem 0',
                    background: 'var(--input)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <SkeletonBase $width="80px" $height={20} $radius={14} />
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <SkeletonBase $width="100px" $height={12} $radius={4} />
                      <SkeletonBase $width="40px" $height={12} $radius={4} />
                    </div>
                  </div>
                  <SkeletonBase $width="90%" $height={16} $radius={4} />
                  <div style={{ marginTop: '0.75rem' }}>
                    <SkeletonBase $width="200px" $height={12} $radius={4} />
                  </div>
                </div>
              ))}
        </ContentWrapper>
      </ContentContainer>
    );
  }

  if (!data || !data.content || data.content.length === 0) {
    return (
      <ContentContainer>
        <EmptyState>
          <EmptyStateIcon>{getEmptyIcon()}</EmptyStateIcon>
          <EmptyStateText>{getEmptyMessage()}</EmptyStateText>
        </EmptyState>
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <ContentWrapper>
        {currentTab === 'posts' && renderPosts(data.content as UserPost[])}
        {currentTab === 'comments' &&
          isOwnProfile &&
          renderComments(data.content as UserComment[])}
        {currentTab === 'followers' &&
          renderFollowers(data.content as FollowerInfo[])}
        {currentTab === 'following' &&
          renderFollowing(data.content as FollowingInfo[])}
      </ContentWrapper>

      {data.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </ContentContainer>
  );
}
