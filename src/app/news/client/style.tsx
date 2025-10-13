import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { primaryButton, mobileOptimized } from '@/components/styled/common';

export const NewsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    margin-bottom: 80px;
  }
`;

export const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }
`;

export const NewsTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${palette.accent};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    text-align: center;
  }
`;

export const SourceTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  background: ${palette.input};
  padding: 0.5rem;
  border-radius: 12px;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.4rem;
    border-radius: 8px;
  }
`;

export const SourceTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) => (props.active ? palette.accent : 'transparent')};
  color: ${(props) =>
    props.active ? palette.bgPage : palette.textSecondary};
  font-weight: ${(props) => (props.active ? '600' : '500')};
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.active ? palette.accent : palette.accentRing};
    transform: ${(props) => (props.active ? 'none' : 'translateY(-1px)')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.6rem 1rem;
    font-size: 0.75rem;
    border-radius: 6px;
  }
`;

export const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

export const NewsCard = styled.article`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  box-shadow: ${palette.shadow};
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: ${palette.accent};
  }

  @media (max-width: 768px) {
    border-radius: 8px;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const NewsThumbnail = styled.div<{ hasImage: boolean }>`
  width: 100%;
  height: 200px;
  background: ${(props) =>
    props.hasImage
      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)'
      : palette.input};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 180px;
  }
`;

export const PlaceholderIcon = styled.div`
  font-size: 3rem;
  color: ${palette.textMuted};
  opacity: 0.5;
`;

export const NewsContent = styled.div`
  padding: 1.25rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const NewsCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
`;

export const SourceBadge = styled.span<{ source: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.source === 'BloomingBit'
      ? 'linear-gradient(135deg, rgba(66, 153, 225, 0.2) 0%, rgba(66, 153, 225, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)'};
  color: ${(props) =>
    props.source === 'BloomingBit' ? '#2c5282' : '#c53030'};
  border: 1px solid
    ${(props) => (props.source === 'BloomingBit' ? '#4299e1' : '#fc8181')};

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.6rem;
  }
`;

export const NewsDate = styled.time`
  font-size: 0.75rem;
  color: ${palette.textMuted};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const NewsCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 0.6rem;
  }
`;

export const NewsDescription = styled.p`
  font-size: 0.9rem;
  color: ${palette.textSecondary};
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
  }
`;

export const NewsKeywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 0.35rem;
    margin-top: 0.75rem;
  }
`;

export const Keyword = styled.span`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  background: ${palette.accentRing};
  color: ${palette.accent};
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 12px;
  border: 1px solid ${palette.border};

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${palette.textMuted};

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

export const EmptyText = styled.p`
  font-size: 1.1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${palette.textSecondary};

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${palette.border};
  border-top-color: ${palette.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }
`;

export const HeadlineBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.7rem;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.3) 0%,
    rgba(255, 215, 0, 0.15) 100%
  );
  color: #b8860b;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 12px;
  border: 1px solid #ffd700;

  &::before {
    content: '⭐';
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.25rem 0.6rem;

    &::before {
      font-size: 0.75rem;
    }
  }
`;

export const NewsActionButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: ${palette.accent};
  color: ${palette.bgPage};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #e6c200;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.85rem;
  }
`;
