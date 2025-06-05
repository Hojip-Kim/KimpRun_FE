import React from 'react';
import styled from 'styled-components';

interface PaginationProps {
  postsPerPage: number;
  totalPosts: number;
  currentPage: number;
  currentCategoryId: number;
  onPageChange: (pageNumber: number) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: ${(props) => (props.isActive ? '#ffd700' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : 'black')};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Pagination: React.FC<PaginationProps> = ({
  postsPerPage,
  totalPosts,
  currentPage,
  currentCategoryId,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageGroup = Math.floor((currentPage - 1) / 10);
  const lastPage = Math.min((pageGroup + 1) * 10, totalPages);
  const firstPage = lastPage - 9 > 0 ? lastPage - 9 : 1;

  const pageNumbers = [];
  for (let i = firstPage; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || totalPosts === 0}
      >
        &lt;
      </PageButton>
      {pageNumbers.map((number) => (
        <PageButton
          key={number}
          onClick={() => onPageChange(number)}
          isActive={currentPage === number}
        >
          {number}
        </PageButton>
      ))}
      <PageButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPosts === 0}
      >
        &gt;
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
