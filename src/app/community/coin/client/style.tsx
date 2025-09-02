import styled from 'styled-components';
import { palette } from '@/styles/palette';

// board row

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const CategoryTag = styled.span<{ isNotice?: boolean }>`
  display: inline-block;
  border: 1px solid ${(props) => (props.isNotice ? '#ffd700' : palette.border)};
  color: ${(props) => (props.isNotice ? '#b8860b' : palette.textSecondary)};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: ${(props) => (props.isNotice ? '600' : '500')};
  background: ${(props) =>
    props.isNotice
      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.1) 100%)'
      : palette.accentRing};
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 2px 8px;
  }
`;

export const StyledRow = styled.div<{ isNotice?: boolean }>`
  display: flex;
  padding: 0.7rem;
  border-bottom: 1px solid ${palette.border};
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;

  ${(props) =>
    props.isNotice &&
    `
    background: rgba(255, 215, 0, 0.1);
  `}

  &:hover {
    background: ${(props) =>
      props.isNotice ? 'rgba(255, 215, 0, 0.15)' : palette.accentRing};
    transform: translateY(-1px);
    box-shadow: ${(props) =>
      props.isNotice
        ? '0 2px 8px rgba(255, 215, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.5rem;
    flex-direction: column;
    gap: 0.5rem;

    &:hover {
      transform: none;
      background: ${(props) =>
        props.isNotice ? 'rgba(255, 215, 0, 0.15)' : palette.accentRing};
      box-shadow: none;
    }
  }
`;

export const Title = styled.h3<{ isNotice?: boolean }>`
  margin: 0;
  font-size: ${(props) => (props.isNotice ? '1.05rem' : '1rem')};
  color: ${(props) => (props.isNotice ? '#b8860b' : palette.accent)};
  cursor: pointer;
  font-weight: ${(props) => (props.isNotice ? '700' : '600')};
  line-height: 1.4;

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: ${(props) => (props.isNotice ? '0.95rem' : '0.9rem')};
    line-height: 1.3;
  }
`;

export const StatValue = styled.div`
  width: 60px;
  text-align: center;
  font-size: 0.875rem;
  color: ${palette.textSecondary};
  font-weight: 500;

  @media (max-width: 768px) {
    width: auto;
    font-size: 0.8rem;
  }
`;

export const TitleSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 숨김 */
  }
`;

export const StatsSection = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 모바일에서 숨김 */
  }
`;

export const NumberCell = styled.div`
  width: 60px;
  text-align: center;
  font-weight: 600;
  color: ${palette.textMuted};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const AuthorCell = styled.div`
  width: 100px;
  text-align: center;
  font-weight: 500;
  color: ${palette.textSecondary};

  @media (max-width: 768px) {
    width: auto;
    text-align: left;
    font-size: 0.8rem;
  }
`;

export const AuthorLink = styled.span`
  color: ${palette.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 6px;

  &:hover {
    color: ${palette.accent};
    background: ${palette.accentRing};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const DateCell = styled.div`
  width: 150px;
  text-align: center;
  font-size: 0.875rem;
  color: ${palette.textMuted};

  @media (max-width: 1024px) {
    width: 120px;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    width: auto;
    text-align: left;
    font-size: 0.75rem;
  }
`;

export const CategoryCell = styled.div`
  width: 100px;
  text-align: center;
  color: ${palette.textSecondary};

  @media (max-width: 768px) {
    width: auto;
    text-align: left;
  }
`;

export const TitleCell = styled.div`
  flex: 1;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0;
    margin-bottom: 0.5rem;
  }
`;

// board

export const BoardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    margin-bottom: 80px; /* 모바일 탭바 공간 */
  }
`;

export const CommunityTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${palette.accent};
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;
export const CategoryHeader = styled.div`
  width: 100px;
  text-align: center;
`;

export const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  /* 드롭다운 너비 제한 */
  & > div:first-child {
    max-width: 200px;
    min-width: 150px;
  }

  @media (max-width: 768px) {
    & > div:first-child {
      max-width: 140px;
      min-width: 120px;
    }
  }
`;

export const WriteButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${palette.bgPage};
  background: ${palette.accent};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${palette.accentRing};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.625rem 1.25rem;
  }
`;

export const PostList = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: ${palette.shadow};

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

export const BoardListHeader = styled.div`
  display: flex;
  padding: 1rem;
  background: ${palette.input};
  border-bottom: 1px solid ${palette.borderSoft};
  font-weight: 600;
  color: ${palette.textSecondary};
  font-size: 0.875rem;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    display: none; /* 모바일에서 헤더 숨김 */
  }
`;

export const NumberHeader = styled.div`
  width: 60px;
  text-align: center;
`;

export const TitleHeader = styled.div`
  flex: 1;
  text-align: left;
  padding-left: 1rem;
`;

export const AuthorHeader = styled.div`
  width: 100px;
  text-align: center;
`;

export const DateHeader = styled.div`
  width: 150px;
  text-align: center;

  @media (max-width: 1024px) {
    width: 120px;
  }
`;

export const StatHeader = styled.div`
  width: 60px;
  text-align: center;
`;

// category buttons

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const CategoryButton = styled.a<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#e0e0e0')};
  }
`;

// category layout

export const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};
`;

export const Header = styled.header`
  background-color: ${palette.card};
  color: ${palette.textPrimary};
  padding: 1rem 0;
  border-bottom: 1px solid ${palette.border};
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  color: #ffd700;
`;

export const Nav = styled.nav`
  display: flex;
`;

export const NavItem = styled.div`
  margin-left: 1.5rem;

  a {
    color: #e0e0e0;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #ffd700;
    }
  }
`;

export const MainContent = styled.main`
  flex: 1;
`;

// pagination

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 0;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    gap: 0.25rem;
  }
`;

export const PageButton = styled.button<{ isActive?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${palette.border};
  background: ${(props) => (props.isActive ? palette.accent : palette.card)};
  color: ${(props) => (props.isActive ? palette.bgPage : palette.textPrimary)};
  cursor: pointer;
  border-radius: 8px;
  font-weight: ${(props) => (props.isActive ? '600' : '400')};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.isActive ? palette.accent : palette.accentRing};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    min-width: 40px;
  }
`;

// 모바일 전용 스타일
export const MobileRowHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
`;

export const MobileRowContent = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 0.8rem;
    color: ${palette.textMuted};
    width: 100%;
  }
`;

export const MobileStats = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    gap: 0.75rem;
    font-size: 0.8rem;
  }
`;

export const MobileStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${palette.textMuted};

  strong {
    color: ${palette.textSecondary};
  }
`;

// Notice tag styles
export const NoticeTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  background: #ffd700;
  color: #8b4513;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &::before {
    content: '📌';
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;

    &::before {
      font-size: 0.7rem;
    }
  }
`;

export const TitleWithNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;
