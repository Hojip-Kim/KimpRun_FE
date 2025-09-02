import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { palette } from '@/styles/palette';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${palette.bgPage};
  padding: 1rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    margin-bottom: 80px;
  }
`;

export const ProfileWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

// 프로필 헤더 스타일
export const ProfileHeaderCard = styled.div`
  background: ${palette.card};
  backdrop-filter: blur(20px);
  border: 1px solid ${palette.border};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${palette.shadow};
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    border-color: ${palette.accent};
    box-shadow: 0 12px 24px -6px ${palette.accentRing}, ${palette.shadow};
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }
`;

export const ProfileHeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 1.5rem;
  animation: ${slideInLeft} 0.6s ease-out 0.2s both;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
    margin-bottom: 1.25rem;
  }
`;

export const ProfileAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${palette.accent};
  border: 4px solid ${palette.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 10px 30px -5px ${palette.accentRing};

  &:hover {
    transform: scale(1.08) rotate(2deg);
    box-shadow: 0 15px 40px -5px ${palette.accentRing};
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const EditAvatarOverlay = styled.button`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${palette.accent};
  border: 2px solid ${palette.card};
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: ${palette.shadow};

  &:hover {
    background: #e6c200;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${slideInRight} 0.6s ease-out 0.4s both;
`;

export const ProfileNameSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ProfileName = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const EditButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${palette.input};
  border: 1px solid ${palette.border};
  color: ${palette.textMuted};
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${palette.accent};
    color: white;
    border-color: ${palette.accent};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
`;

export const EditButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const ProfileBadge = styled.span<{
  $variant?: 'admin' | 'premium' | 'normal';
}>`
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$variant) {
      case 'admin':
        return '#ef4444';
      case 'premium':
        return palette.accent;
      default:
        return palette.input;
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case 'admin':
        return 'white';
      case 'premium':
        return palette.bgPage;
      default:
        return palette.textSecondary;
    }
  }};
`;

export const FollowButton = styled.button<{ $isFollowing: boolean }>`
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  border: 2px solid
    ${(props) => (props.$isFollowing ? palette.border : palette.accent)};
  background: ${(props) =>
    props.$isFollowing ? palette.input : palette.accent};
  color: ${(props) =>
    props.$isFollowing ? palette.textPrimary : palette.bgPage};
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-width: 100px;

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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px ${(props) => (props.$isFollowing ? palette.accentRing : palette.accentRing)},
      0 4px 6px -1px rgba(0, 0, 0, 0.1);

    ${(props) =>
      !props.$isFollowing &&
      `
      background: ${palette.accent};
      border-color: ${palette.accent};
    `}

    ${(props) =>
      props.$isFollowing &&
      `
      background: ${palette.card};
      border-color: ${palette.accent};
      color: ${palette.accent};
    `}
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ProfileStats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 1rem;
  }
`;

export const ProfileStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 60px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -4px ${palette.accentRing};
    border-color: ${palette.accent};
    background: ${palette.card};
  }
`;

export const ProfileStatNumber = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${palette.textPrimary};
  line-height: 1;
`;

export const ProfileStatLabel = styled.span`
  font-size: 0.75rem;
  color: ${palette.textMuted};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ProfileDetails = styled.div`
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

export const ProfileDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px -2px ${palette.accentRing};
    border-color: ${palette.accent};
    background: ${palette.card};
  }
`;

export const ProfileDetailLabel = styled.span`
  color: ${palette.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

export const ProfileDetailValue = styled.span`
  color: ${palette.textPrimary};
  font-weight: 700;
  font-size: 0.85rem;
`;

// 탭 스타일
export const TabContainer = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${palette.shadow};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${palette.accent},
      transparent
    );
  }
`;

export const TabList = styled.div`
  display: flex;
  background: ${palette.input};
  position: relative;
  padding: 0.25rem;
  gap: 0.125rem;

  @media (max-width: 768px) {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${(props) => (props.$active ? palette.card : 'transparent')};
  color: ${(props) =>
    props.$active ? palette.textPrimary : palette.textSecondary};
  font-weight: ${(props) => (props.$active ? '700' : '500')};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$active &&
    `
    box-shadow: 
      0 2px 8px -2px ${palette.accentRing},
      0 1px 3px -1px ${palette.accentRing};
    transform: translateY(-0.5px);
  `}

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
      ${palette.accentRing},
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: ${palette.card};
    color: ${palette.textPrimary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -4px ${palette.accentRing},
      0 2px 4px -1px rgba(0, 0, 0, 0.1);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:active {
    transform: translateY(0);
  }
`;

// 컨텐츠 스타일
export const ContentContainer = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${palette.shadow};
  min-height: 400px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 32px -8px ${palette.accentRing}, ${palette.shadow};
    transform: translateY(-1px);
  }
`;

export const ContentWrapper = styled.div`
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${palette.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }
`;

export const HeaderTitle = styled.span`
  color: ${palette.textPrimary};
  font-weight: 700;
`;

export const HeaderMeta = styled.span`
  font-size: 0.75rem;
  color: ${palette.textMuted};
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: ${palette.textMuted};
  text-align: center;
  background: ${palette.input};
  border-radius: 16px;
  margin: 1rem;
  border: 2px dashed ${palette.borderSoft};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${palette.accent};
    background: ${palette.card};
    transform: translateY(-2px);
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
  filter: grayscale(0.3);
  transition: all 0.3s ease;

  ${EmptyState}:hover & {
    opacity: 0.8;
    filter: grayscale(0);
    transform: scale(1.1);
  }
`;

export const EmptyStateText = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: ${palette.textSecondary};
  transition: color 0.3s ease;

  ${EmptyState}:hover & {
    color: ${palette.textPrimary};
  }
`;

// 게시물/댓글 아이템 스타일
export const PostItem = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -4px ${palette.accentRing},
      0 2px 4px -1px rgba(0, 0, 0, 0.1);
    border-color: ${palette.accent};
  }

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const PostCategory = styled.span`
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, ${palette.accent}, ${palette.accent});
  color: ${palette.bgPage};
  border-radius: 14px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  box-shadow: 0 1px 4px -1px ${palette.accentRing};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-0.5px);
    box-shadow: 0 2px 6px -1px ${palette.accentRing};
  }
`;

export const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${palette.textMuted};
  align-items: center;
  flex-wrap: wrap;
`;

export const PostTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  cursor: pointer;
  line-height: 1.4;
  transition: all 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: ${palette.accent};
    transform: translateX(2px);
  }
`;

export const CommentTargetPost = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: ${palette.borderSoft};
  border-radius: 6px;
  border-left: 3px solid ${palette.accent};
`;

export const CommentTargetTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${palette.textSecondary};
  margin-bottom: 0.25rem;
`;

export const CommentTargetLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &:hover {
    color: ${palette.accent};
  }
`;

export const PostContent = styled.p`
  margin: 0 0 0.75rem 0;
  color: ${palette.textSecondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.875rem;
`;

export const PostStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${palette.textMuted};
  align-items: center;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.4rem;
    border-radius: 8px;
    background: ${palette.borderSoft};
    transition: all 0.2s ease;

    &:hover {
      background: ${palette.accentRing};
      color: ${palette.textPrimary};
    }
  }
`;

// 팔로우 목록 아이템 스타일
export const FollowItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: ${palette.input};
  border: 1px solid ${palette.borderSoft};
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: ${palette.accent};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px -4px ${palette.accentRing},
      0 2px 4px -1px rgba(0, 0, 0, 0.1);
    border-color: ${palette.accent};

    &::before {
      opacity: 1;
    }
  }

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FollowAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${palette.accent}, ${palette.accent});
  border: 3px solid ${palette.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: ${palette.textPrimary};
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      ${palette.accent},
      transparent,
      ${palette.accent}
    );
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px -4px ${palette.accentRing};

    &::after {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

export const FollowInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FollowName = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${palette.textPrimary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${palette.accent};
    transform: translateX(2px);
  }
`;

export const FollowDate = styled.span`
  font-size: 0.8rem;
  color: ${palette.textMuted};
  font-weight: 500;
`;

// 회원탈퇴 섹션 스타일
export const DeleteAccountSection = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  border-top: 1px solid ${palette.border};
  display: flex;
  justify-content: center;
`;

export const DeleteAccountButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
