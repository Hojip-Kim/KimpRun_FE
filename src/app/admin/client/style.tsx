import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { primaryButton, mobileOptimized } from '@/components/styled/common';

// 레이아웃
export const AdminContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${palette.bgPage};
  color: ${palette.textPrimary};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 80px;
  }
`;

export const AdminHeader = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const AdminTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${palette.accent};
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const AdminSubtitle = styled.p`
  font-size: 1rem;
  color: ${palette.textSecondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

// 네비게이션
export const TabNav = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: ${palette.input};
  padding: 0.75rem;
  border-radius: 12px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const TabButton = styled.button<{ active: boolean }>`
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) =>
      props.active ? palette.accent : palette.accentRing};
    transform: ${(props) => (props.active ? 'none' : 'translateY(-1px)')};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
    gap: 0.35rem;
  }
`;

// 카드
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Card = styled.div`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  box-shadow: ${palette.shadow};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${palette.accent};
  margin: 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: ${palette.textSecondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

// 버튼
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  ${(props) => props.variant !== 'secondary' && props.variant !== 'danger' && primaryButton}
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;

  ${(props) =>
    props.variant === 'secondary' &&
    `
    background: ${palette.input};
    color: ${palette.textPrimary};
    border: 1px solid ${palette.border};

    &:hover {
      background: ${palette.accentRing};
    }
  `}

  ${(props) =>
    props.variant === 'danger' &&
    `
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
    color: #dc2626;
    border: 1px solid #dc2626;

    &:hover {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${mobileOptimized}

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

// 폼
export const InputForm = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${palette.border};
  border-radius: 8px;
  background: ${palette.input};
  color: ${palette.textPrimary};
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }

  &::placeholder {
    color: ${palette.textMuted};
  }

  @media (max-width: 768px) {
    padding: 0.6rem 0.875rem;
    font-size: 0.85rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

// 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const TableHeader = styled.thead`
  background: ${palette.input};
  border-bottom: 1px solid ${palette.border};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${palette.border};
  transition: background 0.2s ease;

  &:hover {
    background: ${palette.accentRing};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${palette.textSecondary};
  font-size: 0.875rem;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
`;

export const TableCell = styled.td`
  padding: 1rem;
  color: ${palette.textPrimary};
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
`;

// 상태 배지
export const StatusBadge = styled.span<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;

  ${(props) => {
    switch (props.status) {
      case 'success':
        return `
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
          color: #16a34a;
          border: 1px solid #22c55e;
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%);
          color: #ca8a04;
          border: 1px solid #fbbf24;
        `;
      case 'error':
        return `
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
          color: #dc2626;
          border: 1px solid #dc2626;
        `;
      case 'info':
      default:
        return `
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
          color: #2563eb;
          border: 1px solid #3b82f6;
        `;
    }
  }}

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }
`;

// 로딩 & 빈 상태
export const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${palette.textSecondary};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${palette.textMuted};

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
