import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const DetailContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    margin-bottom: 80px;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  color: ${palette.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    background: ${palette.input};
    color: ${palette.textPrimary};
    border-color: ${palette.accent};
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
`;

export const DetailHeader = styled.header`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const DetailMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const SourceBadge = styled.span<{ source: string }>`
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 16px;
  font-size: 0.85rem;
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
    font-size: 0.75rem;
    padding: 0.3rem 0.75rem;
  }
`;

export const HeadlineBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.85rem;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.3) 0%,
    rgba(255, 215, 0, 0.15) 100%
  );
  color: #b8860b;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 12px;
  border: 1px solid #ffd700;

  &::before {
    content: '⭐';
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.3rem 0.75rem;

    &::before {
      font-size: 0.8rem;
    }
  }
`;

export const NewsDate = styled.time`
  font-size: 0.85rem;
  color: ${palette.textMuted};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const DetailTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  line-height: 1.4;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export const KeywordsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
`;

export const KeywordTag = styled.span`
  display: inline-block;
  padding: 0.4rem 0.9rem;
  background: ${palette.accentRing};
  color: ${palette.accent};
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 16px;
  border: 1px solid ${palette.border};

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.35rem 0.75rem;
  }
`;

export const ThumbnailContainer = styled.div`
  width: 100%;
  max-height: 500px;
  background: ${palette.input};
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  @media (max-width: 768px) {
    max-height: 300px;
    min-height: 200px;
    margin-bottom: 1.5rem;
    border-radius: 8px;
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.05) 0%,
    rgba(255, 215, 0, 0.02) 100%
  );
`;

export const PlaceholderIcon = styled.div`
  font-size: 5rem;
  color: ${palette.textMuted};
  opacity: 0.3;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

export const DetailContent = styled.article`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${palette.shadow};

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
  }
`;

export const ContentText = styled.div`
  font-size: 1.1rem;
  color: ${palette.textPrimary};
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.7;
  }
`;

export const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`;

export const ViewOriginalButton = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 1rem 2rem;
  background: ${palette.accent};
  color: ${palette.bgPage};
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);

  &:hover {
    background: #e6c200;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.75rem;
    font-size: 1rem;
    border-radius: 8px;
  }
`;

export const SourceInfo = styled.p`
  font-size: 0.9rem;
  color: ${palette.textMuted};
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;
