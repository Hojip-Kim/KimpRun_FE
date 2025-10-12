'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { palette } from '@/styles/palette';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBase = styled.div<{
  $height?: number;
  $width?: string;
  $radius?: number;
}>`
  display: block;
  height: ${(p) => (p.$height ? `${p.$height}px` : '12px')};
  width: ${(p) => p.$width || '100%'};
  border-radius: ${(p) => (p.$radius !== undefined ? `${p.$radius}px` : '8px')};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 25%,
    rgba(255, 255, 255, 0.12) 37%,
    rgba(255, 255, 255, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.3s ease-in-out infinite;
`;

const Card = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  box-shadow: ${palette.shadow};
`;

// Market selector skeleton
const SelectorContainer = styled(Card)`
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 16px;
  padding: 14px;
  margin-bottom: 12px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    gap: 8px;
    padding: 8px;
  }
`;

const SelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MarketSelectorSkeleton: React.FC = () => (
  <SelectorContainer>
    {[0, 1].map((i) => (
      <SelectorGroup key={i}>
        <SkeletonBase $width="80px" $height={10} $radius={6} />
        <SkeletonBase $height={36} $radius={10} />
      </SelectorGroup>
    ))}
  </SelectorContainer>
);

// Search skeleton
const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 5px;
`;
const SearchTop = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;
const SearchBottom = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
`;

export const SearchSkeleton: React.FC = () => (
  <SearchWrap>
    <SearchTop>
      <SkeletonBase $width="100px" $height={36} $radius={10} />
      <SkeletonBase $width="120px" $height={36} $radius={10} />
    </SearchTop>
    <SearchBottom>
      <SkeletonBase $width="100%" $height={36} $radius={10} />
      <SkeletonBase $width="120px" $height={36} $radius={10} />
    </SearchBottom>
  </SearchWrap>
);

// Table skeleton (aligned to TableWrapper/Row)
const TableShell = styled(Card)`
  width: 100%;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  margin: 0 20px 0 0; /* match TableWrapper spacing */
`;
const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid ${palette.border};
  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;
const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => (
  <TableShell>
    <HeaderRow>
      {Array.from({ length: 7 }).map((_, i) => (
        <SkeletonBase key={i} $height={12} $radius={6} />
      ))}
    </HeaderRow>
    <Rows>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: '0 8px',
            borderBottom: `1px solid ${palette.border}`,
          }}
        >
          <SkeletonBase $height={32} $radius={6} />
        </div>
      ))}
    </Rows>
  </TableShell>
);

// Chart skeleton (mobile small area or desktop left card can reuse)
export const ChartSkeleton: React.FC<{ height?: number }> = ({
  height = 200,
}) => (
  <Card style={{ overflow: 'hidden', borderRadius: 10 }}>
    <SkeletonBase $height={height} $radius={10} />
  </Card>
);

export const PageSkeleton: React.FC = () => (
  <div>
    <MarketSelectorSkeleton />
    <div style={{ margin: '8px 0 12px' }}>
      <ChartSkeleton height={200} />
    </div>
    <SearchSkeleton />
    <TableSkeleton rows={12} />
  </div>
);

export default SkeletonBase;

// ===== Notice skeleton =====
const NoticeCard = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const NoticeHeader = styled.div`
  padding: 15px 20px;
  background: ${palette.input};
  border-bottom: 1px solid ${palette.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const NoticeList = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const NoticeSkeleton: React.FC<{ items?: number }> = ({ items = 6 }) => (
  <NoticeCard>
    <NoticeHeader>
      <SkeletonBase $width="100px" $height={16} $radius={6} />
      <SkeletonBase $width="140px" $height={36} $radius={10} />
    </NoticeHeader>
    <NoticeList>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SkeletonBase $width="80px" $height={18} $radius={6} />
            <SkeletonBase $width="60px" $height={12} $radius={6} />
          </div>
          <SkeletonBase $width="100%" $height={14} $radius={8} />
          <SkeletonBase $width="72px" $height={12} $radius={6} />
        </div>
      ))}
    </NoticeList>
  </NoticeCard>
);

// ===== Chat skeleton =====
const ChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const ChatStatus = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${palette.border};
  margin-bottom: 8px;
`;
const ChatArea = styled(Card)`
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ChatFooter = styled.div`
  display: flex;
  margin-top: 10px;
  gap: 8px;
`;
export const ChatSkeleton: React.FC = () => (
  <ChatWrap>
    <ChatStatus>
      <SkeletonBase $width="140px" $height={14} $radius={6} />
    </ChatStatus>
    <ChatArea>
      <SkeletonBase $width="140px" $height={12} $radius={6} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: i % 2 ? 'flex-end' : 'flex-start',
          }}
        >
          <SkeletonBase
            $width={i % 2 ? '60%' : '70%'}
            $height={24}
            $radius={12}
          />
        </div>
      ))}
    </ChatArea>
    <ChatFooter>
      <SkeletonBase $width="100%" $height={40} $radius={12} />
      <SkeletonBase $width="80px" $height={40} $radius={12} />
    </ChatFooter>
  </ChatWrap>
);

// ===== Community skeleton =====
const CommunityContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    margin-bottom: 80px;
  }
`;

const CommunityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const BoardListContainer = styled(Card)`
  overflow: hidden;
  padding: 0;
`;

const BoardListHeader = styled.div`
  display: flex;
  padding: 1rem;
  background: ${palette.input};
  border-bottom: 1px solid ${palette.border};
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BoardRowSkeleton = styled.div`
  display: flex;
  padding: 0.7rem;
  border-bottom: 1px solid ${palette.borderSoft};
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex: 1;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

const StatsSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

// 게시판 목록 스켈레톤
export const CommunityBoardSkeleton: React.FC<{ rows?: number }> = ({
  rows = 10,
}) => (
  <CommunityContainer>
    {/* 헤더 */}
    <CommunityHeader>
      <SkeletonBase $width="150px" $height={36} $radius={10} />
      <SkeletonBase $width="80px" $height={36} $radius={10} />
    </CommunityHeader>

    {/* 게시글 목록 */}
    <BoardListContainer>
      {/* 헤더 */}
      <BoardListHeader>
        <TitleSection>
          <SkeletonBase $width="40px" $height={12} $radius={6} />
          <SkeletonBase $width="60px" $height={12} $radius={6} />
          <SkeletonBase $width="100px" $height={12} $radius={6} />
          <SkeletonBase $width="60px" $height={12} $radius={6} />
          <SkeletonBase $width="60px" $height={12} $radius={6} />
        </TitleSection>
        <StatsSection>
          <SkeletonBase $width="40px" $height={12} $radius={6} />
          <SkeletonBase $width="40px" $height={12} $radius={6} />
          <SkeletonBase $width="40px" $height={12} $radius={6} />
        </StatsSection>
      </BoardListHeader>

      {/* 게시글 rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <BoardRowSkeleton key={i}>
          <TitleSection>
            <SkeletonBase $width="40px" $height={16} $radius={6} />
            <SkeletonBase $width="80px" $height={20} $radius={10} />
            <SkeletonBase $width="60%" $height={16} $radius={6} />
            <SkeletonBase $width="80px" $height={16} $radius={6} />
            <SkeletonBase $width="100px" $height={16} $radius={6} />
          </TitleSection>
          <StatsSection>
            <SkeletonBase $width="30px" $height={16} $radius={6} />
            <SkeletonBase $width="30px" $height={16} $radius={6} />
            <SkeletonBase $width="30px" $height={16} $radius={6} />
          </StatsSection>
        </BoardRowSkeleton>
      ))}
    </BoardListContainer>

    {/* 페이지네이션 */}
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}
    >
      <SkeletonBase $width="200px" $height={36} $radius={10} />
    </div>
  </CommunityContainer>
);

// 게시글 상세 스켈레톤
const PostContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 800px) {
    margin: 1rem auto;
  }
`;

const PostHeader = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const PostContent = styled(Card)`
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const CommentSection = styled(Card)`
  padding: 1.5rem;
`;

export const CommunityPostSkeleton: React.FC = () => (
  <PostContainer>
    {/* 게시글 헤더 */}
    <PostHeader>
      <div style={{ marginBottom: '1rem' }}>
        <SkeletonBase $width="100px" $height={20} $radius={10} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <SkeletonBase $width="80%" $height={24} $radius={8} />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <SkeletonBase $width="80px" $height={16} $radius={6} />
          <SkeletonBase $width="120px" $height={16} $radius={6} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SkeletonBase $width="40px" $height={16} $radius={6} />
          <SkeletonBase $width="40px" $height={16} $radius={6} />
        </div>
      </div>
    </PostHeader>

    {/* 게시글 내용 */}
    <PostContent>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <SkeletonBase $width="100%" $height={16} $radius={6} />
        <SkeletonBase $width="90%" $height={16} $radius={6} />
        <SkeletonBase $width="95%" $height={16} $radius={6} />
        <SkeletonBase $width="85%" $height={16} $radius={6} />
        <SkeletonBase $width="100%" $height={100} $radius={8} />
        <SkeletonBase $width="75%" $height={16} $radius={6} />
        <SkeletonBase $width="80%" $height={16} $radius={6} />
      </div>
    </PostContent>

    {/* 댓글 섹션 */}
    <CommentSection>
      <div style={{ marginBottom: '1rem' }}>
        <SkeletonBase $width="100px" $height={20} $radius={8} />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          style={{ marginBottom: '1rem', paddingLeft: i === 1 ? '2rem' : '0' }}
        >
          <div
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
          >
            <SkeletonBase $width="80px" $height={14} $radius={6} />
            <SkeletonBase $width="100px" $height={14} $radius={6} />
          </div>
          <SkeletonBase $width="90%" $height={40} $radius={8} />
        </div>
      ))}
    </CommentSection>
  </PostContainer>
);

// 글쓰기 페이지 스켈레톤
const WriteContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 1rem;
    margin-bottom: 100px;
  }
`;

const WriteCard = styled(Card)`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CommunityWriteSkeleton: React.FC = () => (
  <WriteContainer>
    <WriteCard>
      <div style={{ marginBottom: '1.5rem' }}>
        <SkeletonBase $width="150px" $height={28} $radius={8} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SkeletonBase $width="100%" $height={48} $radius={8} />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <SkeletonBase $width="100%" $height={300} $radius={8} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <SkeletonBase $width="80px" $height={40} $radius={8} />
        <SkeletonBase $width="80px" $height={40} $radius={8} />
      </div>
    </WriteCard>
  </WriteContainer>
);

// ===== Coin Detail skeleton =====
const CoinDetailContainer = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
`;

const CoinHeaderSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
`;

const CoinInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CoinInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CoinDetailSkeleton: React.FC = () => (
  <CoinDetailContainer>
    {/* 왼쪽 섹션 */}
    <div>
      {/* 코인 헤더 (로고 + 이름) */}
      <CoinHeaderSection>
        <SkeletonBase $width="48px" $height={48} $radius={24} />
        <div style={{ flex: 1 }}>
          <SkeletonBase $width="120px" $height={20} $radius={6} />
          <div style={{ marginTop: '5px' }}>
            <SkeletonBase $width="60px" $height={16} $radius={6} />
          </div>
        </div>
      </CoinHeaderSection>

      {/* 기본 정보 */}
      <CoinInfoSection>
        <CoinInfoRow>
          <SkeletonBase $width="40px" $height={16} $radius={6} />
          <SkeletonBase $width="60px" $height={16} $radius={6} />
        </CoinInfoRow>
        <CoinInfoRow>
          <SkeletonBase $width="70px" $height={16} $radius={6} />
          <SkeletonBase $width="100px" $height={16} $radius={6} />
        </CoinInfoRow>
        <CoinInfoRow>
          <SkeletonBase $width="60px" $height={16} $radius={6} />
          <SkeletonBase $width="120px" $height={16} $radius={6} />
        </CoinInfoRow>
        <CoinInfoRow>
          <SkeletonBase $width="80px" $height={16} $radius={6} />
          <SkeletonBase $width="140px" $height={16} $radius={6} />
        </CoinInfoRow>
      </CoinInfoSection>
    </div>

    {/* 오른쪽 섹션 */}
    <div>
      <CoinInfoSection>
        <CoinInfoRow>
          <SkeletonBase $width="50px" $height={16} $radius={6} />
          <SkeletonBase $width="80px" $height={16} $radius={6} />
        </CoinInfoRow>
        <CoinInfoRow>
          <SkeletonBase $width="90px" $height={16} $radius={6} />
          <SkeletonBase $width="100px" $height={16} $radius={6} />
        </CoinInfoRow>
        <CoinInfoRow>
          <SkeletonBase $width="70px" $height={16} $radius={6} />
          <SkeletonBase $width="110px" $height={16} $radius={6} />
        </CoinInfoRow>

        {/* 설명 텍스트 영역 */}
        <div style={{ marginTop: '15px' }}>
          <SkeletonBase $width="40px" $height={16} $radius={6} />
          <div style={{ marginTop: '8px' }}>
            <SkeletonBase $width="100%" $height={16} $radius={6} />
          </div>
          <div style={{ marginTop: '5px' }}>
            <SkeletonBase $width="90%" $height={16} $radius={6} />
          </div>
          <div style={{ marginTop: '5px' }}>
            <SkeletonBase $width="75%" $height={16} $radius={6} />
          </div>
        </div>
      </CoinInfoSection>
    </div>
  </CoinDetailContainer>
);

// ===== Chart Map skeleton =====
const ChartMapGridSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const ChartSlotSkeleton = styled.div`
  position: relative;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  overflow: hidden;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    min-height: 300px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const ChartHeaderSkeleton = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${palette.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
`;

const ChartTitleSkeleton = styled(SkeletonBase)`
  width: 80px;
  height: 16px;
  border-radius: 4px;
`;

const ChartButtonsSkeleton = styled.div`
  display: flex;
  gap: 8px;
`;

const ChartButtonSkeleton = styled(SkeletonBase)`
  width: 28px;
  height: 28px;
  border-radius: 6px;
`;

const ChartAreaSkeleton = styled(SkeletonBase)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  border-radius: 0;
`;

const AddButtonSkeleton = styled(SkeletonBase)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const AddTextSkeleton = styled(SkeletonBase)`
  width: 80px;
  height: 16px;
  border-radius: 4px;
`;

// 차트맵 스켈레톤 메인 컴포넌트
export const ChartMapSkeleton: React.FC = () => {
  return (
    <ChartMapGridSkeleton>
      {/* 활성화된 차트 스켈레톤 (처음 2개) */}
      {[0, 1].map((index) => (
        <ChartSlotSkeleton
          key={`active-${index}`}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <ChartHeaderSkeleton>
            <ChartTitleSkeleton />
            <ChartButtonsSkeleton>
              <ChartButtonSkeleton />
              <ChartButtonSkeleton />
            </ChartButtonsSkeleton>
          </ChartHeaderSkeleton>
          <div style={{ flex: 1, position: 'relative' }}>
            <ChartAreaSkeleton />
          </div>
        </ChartSlotSkeleton>
      ))}

      {/* 빈 슬롯 스켈레톤 (나머지 4개) */}
      {[2, 3, 4, 5].map((index) => (
        <ChartSlotSkeleton key={`empty-${index}`}>
          <AddButtonSkeleton />
          <AddTextSkeleton />
        </ChartSlotSkeleton>
      ))}
    </ChartMapGridSkeleton>
  );
};

// ===== Profile skeleton =====
const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${palette.bgPage};
  padding: 1rem;
  position: relative;
`;

const ProfileWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ProfileHeaderSkeleton = styled(Card)`
  padding: 1.5rem;
  border-radius: 16px;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }
`;

const ProfileHeaderTopSkeleton = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
  }
`;

const ProfileAvatarSkeleton = styled(SkeletonBase)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const ProfileInfoSkeleton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfileNameSectionSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ProfileStatsSkeleton = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
`;

const ProfileStatSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  min-width: 60px;
`;

const ProfileDetailsSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid ${palette.border};
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const ProfileDetailSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 8px;
`;

const ProfileTabsSkeleton = styled(Card)`
  border-radius: 20px;
  overflow: hidden;
`;

const ProfileTabListSkeleton = styled.div`
  display: flex;
  background: ${palette.input};
  position: relative;
  padding: 0.25rem;
  gap: 0.125rem;
`;

const ProfileTabButtonSkeleton = styled(SkeletonBase)`
  flex: 1;
  height: 44px;
  border-radius: 12px;
`;

const ProfileContentSkeleton = styled(Card)`
  border-radius: 20px;
  overflow: hidden;
  min-height: 400px;
`;

const ProfileContentWrapperSkeleton = styled.div`
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const ProfileContentHeaderSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }
`;

const ProfilePostItemSkeleton = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 12px;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProfilePostHeaderSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProfilePostMetaSkeleton = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const ProfileFollowItemSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 12px;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProfileFollowAvatarSkeleton = styled(SkeletonBase)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const ProfileFollowInfoSkeleton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// 프로필 전체 페이지 스켈레톤
export const ProfileSkeleton: React.FC<{ isOwnProfile?: boolean }> = ({
  isOwnProfile = true,
}) => (
  <ProfileContainer>
    <ProfileWrapper>
      {/* 프로필 헤더 */}
      <ProfileHeaderSkeleton>
        <ProfileHeaderTopSkeleton>
          <ProfileAvatarSkeleton />
          <ProfileInfoSkeleton>
            <ProfileNameSectionSkeleton>
              <SkeletonBase $width="150px" $height={24} $radius={6} />
              <SkeletonBase $width="60px" $height={20} $radius={12} />
              <SkeletonBase $width="40px" $height={20} $radius={12} />
            </ProfileNameSectionSkeleton>

            {!isOwnProfile && (
              <SkeletonBase $width="100px" $height={32} $radius={20} />
            )}

            <ProfileStatsSkeleton>
              {[0, 1, 2].map((i) => (
                <ProfileStatSkeleton key={i}>
                  <SkeletonBase $width="24px" $height={20} $radius={4} />
                  <SkeletonBase $width="40px" $height={12} $radius={4} />
                </ProfileStatSkeleton>
              ))}
            </ProfileStatsSkeleton>
          </ProfileInfoSkeleton>
        </ProfileHeaderTopSkeleton>

        <ProfileDetailsSkeleton>
          {Array.from({ length: isOwnProfile ? 4 : 3 }).map((_, i) => (
            <ProfileDetailSkeleton key={i}>
              <SkeletonBase $width="60px" $height={12} $radius={4} />
              <SkeletonBase $width="80px" $height={12} $radius={4} />
            </ProfileDetailSkeleton>
          ))}
        </ProfileDetailsSkeleton>
      </ProfileHeaderSkeleton>

      {/* 프로필 탭 */}
      <ProfileTabsSkeleton>
        <ProfileTabListSkeleton>
          {Array.from({ length: isOwnProfile ? 4 : 3 }).map((_, i) => (
            <ProfileTabButtonSkeleton key={i} />
          ))}
        </ProfileTabListSkeleton>
      </ProfileTabsSkeleton>

      {/* 프로필 컨텐츠 */}
      <ProfileContentSkeleton>
        <ProfileContentWrapperSkeleton>
          <ProfileContentHeaderSkeleton>
            <SkeletonBase $width="120px" $height={16} $radius={4} />
            <SkeletonBase $width="80px" $height={12} $radius={4} />
          </ProfileContentHeaderSkeleton>

          {/* 게시물/댓글 아이템들 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <ProfilePostItemSkeleton key={i}>
              <ProfilePostHeaderSkeleton>
                <SkeletonBase $width="80px" $height={20} $radius={14} />
                <ProfilePostMetaSkeleton>
                  <SkeletonBase $width="100px" $height={12} $radius={4} />
                  <SkeletonBase $width="40px" $height={12} $radius={4} />
                </ProfilePostMetaSkeleton>
              </ProfilePostHeaderSkeleton>
              <SkeletonBase $width="90%" $height={16} $radius={4} />
              <div style={{ marginTop: '0.5rem' }}>
                <SkeletonBase $width="200px" $height={12} $radius={4} />
              </div>
            </ProfilePostItemSkeleton>
          ))}
        </ProfileContentWrapperSkeleton>
      </ProfileContentSkeleton>
    </ProfileWrapper>
  </ProfileContainer>
);

// 팔로우 목록용 스켈레톤
export const ProfileFollowSkeleton: React.FC = () => (
  <ProfileContentWrapperSkeleton>
    <ProfileContentHeaderSkeleton>
      <SkeletonBase $width="100px" $height={16} $radius={4} />
      <SkeletonBase $width="60px" $height={12} $radius={4} />
    </ProfileContentHeaderSkeleton>

    {Array.from({ length: 8 }).map((_, i) => (
      <ProfileFollowItemSkeleton key={i}>
        <ProfileFollowAvatarSkeleton />
        <ProfileFollowInfoSkeleton>
          <SkeletonBase $width="100px" $height={16} $radius={4} />
          <SkeletonBase $width="140px" $height={12} $radius={4} />
        </ProfileFollowInfoSkeleton>
      </ProfileFollowItemSkeleton>
    ))}
  </ProfileContentWrapperSkeleton>
);
