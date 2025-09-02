import styled from 'styled-components';
import { palette } from '@/styles/palette';

export const RowContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  min-height: 0;
  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  margin: 0 20px 0px 0px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-padding-bottom: 120px;
  padding-bottom: 120px;
  border: 1px solid ${palette.border};
  border-radius: 12px;
  background: ${palette.card};
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const StyledTable = styled.table`
  table-layout: fixed;
  border: solid rgba(123, 123, 123, 0.2);
  width: 100%;
  border-collapse: collapse;
`;
export const TableBody = styled.div`
  width: 100%;
`;

export const HeaderRow = styled.tr`
  display: flex;
  width: 100%;
  @media (max-width: 768px) {
    display: table-row;
    th:nth-child(5),
    th:nth-child(6) {
      display: none;
    }
  }
`;

export const TableHeader = styled.th`
  color: ${palette.textPrimary};
  font-size: 0.6rem;
  text-align: center;
  position: relative;
  padding: 3px;
  display: table-cell;
  width: ${100 / 7}%;
  box-sizing: border-box;
  border-bottom: 1px solid ${palette.border};
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 215, 0, 0.06);
    color: ${palette.accent};
  }
  @media (max-width: 768px) {
    width: calc(100% / 5);
  }
`;

export const HeaderTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  position: sticky;
  top: 0;
  background: ${palette.card};
  z-index: 1;
`;

export const BodyTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
`;
export const SortButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${palette.textMuted};
  transition: all 0.2s ease;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  svg {
    width: 12px;
    height: 12px;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: ${palette.accent};
  }

  &.active {
    color: ${palette.accent};

    svg {
      transform: scale(1.2);
    }
  }
`;
export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 0 20px 0 0;
  text-align: center;
`;

export const TableRow = styled.tr<{ $isExpanded?: boolean }>`
  text-align: right;
  font-size: 0.6rem;
  border-bottom: 1px solid ${palette.border};
  transition: background-color 0.2s ease;
  cursor: pointer;

  @media (max-width: 768px) {
    td:nth-child(5),
    td:nth-child(6) {
      display: none;
    }
  }

  &:hover {
    background-color: ${palette.bgContainer};
    td {
      color: ${palette.accent};
    }
  }

  &.fade-out {
    background-color: rgba(0, 0, 0, 0);
  }

  ${({ $isExpanded }) =>
    $isExpanded &&
    `
    background-color: ${palette.bgContainer};
    td {
      background-color: ${palette.bgContainer};
    }
  `}
`;

export const TableCell = styled.td`
  color: ${palette.textPrimary};
  text-align: center;
  font-size: 0.6rem;
  display: table-cell;
  width: 16%;
  padding: 3px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    width: calc(100% / 5);
  }
`;

export const ExpandableContent = styled.div<{ $isExpanded: boolean }>`
  padding: ${({ $isExpanded }) => ($isExpanded ? '1.5rem' : '0')};
  border: none;
  background: ${palette.bgPage};
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .coin-detail-responsive {
    @media (max-width: 768px) {
      display: grid !important;
      grid-template-columns: auto 1fr 1fr;
      grid-template-rows: auto auto;
      gap: 0.75rem;
      padding: 0.75rem;
      font-size: 0.7rem;

      /* 로고와 기본 정보 섹션 - 컴팩트한 세로 배치 */
      & > div:first-child {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        min-width: 60px;
        order: 1;

        img {
          width: 32px !important;
          height: 32px !important;
          margin-bottom: 0.25rem !important;
          border-radius: 50%;
        }

        & > div {
          text-align: center !important;

          h3 {
            font-size: 0.75rem !important;
            margin-bottom: 0.1rem !important;
            color: var(--accent) !important;
            font-weight: 600;
          }

          p:first-of-type {
            font-size: 0.65rem !important;
            font-weight: 500 !important;
            margin-bottom: 0.2rem !important;
            color: var(--text-muted);
          }

          p:last-of-type {
            font-size: 0.6rem !important;
            padding: 0.1rem 0.3rem;
            background: var(--accent);
            color: white;
            border-radius: 6px;
            display: inline-block;
          }
        }
      }

      /* 공급량 정보 - 헤더/바디 구조 */
      & > div:nth-child(2) {
        order: 2;

        h4 {
          font-size: 0.7rem !important;
          margin-bottom: 0.4rem !important;
          color: var(--accent) !important;
          font-weight: 600;
        }

        & > div {
          & > div {
            margin-bottom: 0.2rem;

            span:first-child {
              font-size: 0.6rem !important;
            }

            span:last-child {
              font-size: 0.6rem !important;
            }
          }
        }
      }

      /* 시장 정보 - 헤더/바디 구조 */
      & > div:nth-child(3) {
        order: 3;

        h4 {
          font-size: 0.7rem !important;
          margin-bottom: 0.4rem !important;
          color: var(--accent) !important;
          font-weight: 600;
        }

        & > div {
          & > div {
            margin-bottom: 0.2rem;

            span:first-child {
              font-size: 0.6rem !important;
            }

            span:last-child {
              font-size: 0.6rem !important;
            }
          }
        }

        /* 플랫폼 태그 컴팩트하게 */
        & > div:last-child {
          margin-top: 0.5rem !important;

          & > div:first-child span {
            font-size: 0.55rem !important;
          }

          & > div:last-child {
            span {
              font-size: 0.55rem !important;
              padding: 0.1rem 0.3rem !important;
            }
          }
        }
      }

      /* 탐색기 링크 - 전체 너비, 컴팩트 */
      & > div:last-child {
        grid-column: 1 / -1 !important;
        order: 4;
        margin-top: 0.25rem;
        padding-top: 0.5rem;
        border-top: 1px solid var(--border);

        & > div:first-child {
          margin-bottom: 0.4rem !important;

          span {
            font-size: 0.65rem !important;
            font-weight: 600 !important;
            color: var(--accent) !important;
          }
        }

        & > div:last-child {
          display: grid !important;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem;

          a {
            font-size: 0.6rem !important;
            padding: 0.3rem 0.5rem !important;
            border-radius: 4px !important;
            background: var(--accent-ring) !important;
            border: 1px solid var(--accent) !important;
            text-align: center;
            font-weight: 500;
            transition: all 0.2s ease !important;

            &:hover {
              background: var(--accent) !important;
              color: white !important;
            }
          }
        }
      }
    }
  }
`;
