'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/app/admin/type';
import { ButtonContainer, CategoryButton } from './style';

interface CategoryButtonsProps {
  categories: Category[];
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
