import styled from 'styled-components';

export const RowContainer = styled.div`
  position: relative;
  height: 700px;
`;

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;

  justify-content: center;
  height: 100%;
`;

export const StyledTable = styled.table`
  table-layout: fixed;
  border: solid rgba(123, 123, 123, 0.4);
  width: 100%;
  border-collapse: collapse;
`;

export const TableBody = styled.div`
  overflow-y: auto;
  height: calc(100% - 40px);
  border: 1px solid rgba(123, 123, 123, 0.4);

  table {
    width: 100%;
    border-top: none;
  }

  td {
    width: 12.5%;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(123, 123, 123, 0.5);
    border-radius: 10px;
    &:hover {
      background-color: rgba(123, 123, 123, 0.8);
    }
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
`;

export const HeaderRow = styled.tr`
  // border-bottom: solid rgba(123, 123, 123, 0.4);
  display: flex;
`;

export const TableHeader = styled.th`
  color: #e0e0e0;
  font-size: 0.6rem;
  text-align: center;
  position: relative;
  padding: 3px;
  display: table-cell;
  width: 12.5%;
  box-sizing: border-box;
`;

export const HeaderTable = styled(StyledTable)`
  margin-bottom: -1px;
  width: 100%;
  table-layout: fixed;
`;

export const BodyTable = styled(StyledTable)`
  border-top: none;
  width: 100%;
  table-layout: fixed;
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

export const TableRow = styled.tr<{ isExpanded?: boolean }>`
  text-align: right;
  font-size: 0.6rem;
  border-bottom: solid rgba(96, 96, 96, 0.4);
  transition: background-color 0.4s ease-in-out;

  &:hover {
    td {
      color: rgba(255, 215, 0);
    }
    cursor: pointer;
  }

  &.fade-out {
    background-color: rgba(0, 0, 0, 0);
  }

  ${({ isExpanded }) =>
    isExpanded &&
    `
    background-color: #404040;
  `}
`;

export const TableCell = styled.td`
  color: #e0e0e0;
  text-align: center;
  font-size: 0.6rem;
  display: table-cell;
  width: 12.5%;
  padding: 3px;
  box-sizing: border-box;
`;

export const ExpandableContent = styled.div<{ isExpanded: boolean }>`
  padding: 10px;
  border: 1px solid #555;
  border-radius: 4px;
  height: ${({ isExpanded }) => (isExpanded ? 'auto' : '0')};
  overflow: hidden;
  background-color: #131722;
  transition: background-color 0.3s ease, color 0.3s ease;
`;
