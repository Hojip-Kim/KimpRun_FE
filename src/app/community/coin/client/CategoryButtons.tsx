'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { category } from '@/app/admin/server/fetchCategory';

interface CategoryButtonsProps {
  categories: category[];
  currentCategoryId?: number;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  categories,
  currentCategoryId,
}) => {
  return (
    <ButtonContainer>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/community/coin/${category.id}`}
          passHref
        >
          <CategoryButton active={category.id === currentCategoryId}>
            {category.categoryName}
          </CategoryButton>
        </Link>
      ))}
    </ButtonContainer>
  );
};

export default CategoryButtons;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const CategoryButton = styled.a<{ active: boolean }>`
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
