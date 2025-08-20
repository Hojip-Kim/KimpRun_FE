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
  color: #888;
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
    color: #ffd700;
  }

  &.active {
    color: #ffd700;

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
  border-bottom: solid ${palette.border};
  transition: background-color 0.4s ease-in-out;
  @media (max-width: 768px) {
    td:nth-child(5),
    td:nth-child(6) {
      display: none;
    }
  }

  &:hover {
    td {
      color: ${palette.accent};
      background-color: rgba(255, 215, 0, 0.06);
    }
    cursor: pointer;
  }

  &.fade-out {
    background-color: rgba(0, 0, 0, 0);
  }

  ${({ $isExpanded }) =>
    $isExpanded &&
    `
    background-color: #202635;
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
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  height: ${({ $isExpanded }) => ($isExpanded ? 'auto' : '0')};
  overflow: hidden;
  background-color: #131722;
  transition: background-color 0.3s ease, color 0.3s ease;
`;
