'use client';
import React, { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../server/fetchCategory';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { redirect } from 'next/navigation';
import { ProcessedApiResponse } from '@/server/type';
import { Category, CategoryResponse } from '../type';
import { InputForm } from './style';

interface AdminPageProps {
  initialCategories: Category[];
}

const AdminPageClient = ({ initialCategories }: AdminPageProps) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');

  const user = useSelector((state: RootState) => state.auth.user);

  const checkUserRole = () => {
    const userRole = user?.role;
    if (userRole !== 'OPERATOR' && userRole !== 'MANAGER') {
      alert('관리자가 아닙니다');
      redirect('/');
    }
  };

  const handleSubmit = async (formData: React.FormEvent<HTMLFormElement>) => {
    formData.preventDefault();
    try {
      const response: ProcessedApiResponse<CategoryResponse> =
        await createCategory({
          name: categoryName,
          description: '',
        });
      if (response.success && response.data) {
        // 새로 생성된 카테고리를 목록에 추가 (전체 카테고리 목록을 다시 설정)
        setCategories(response.data.categories);
        setCategoryName('');
        alert(`카테고리 추가 완료`);
      } else {
        alert('카테고리 추가 실패');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const response: ProcessedApiResponse<Category> = await updateCategory(
        id,
        editCategoryName,
        ''
      );
      if (response.success && response.data) {
        setCategories(
          categories.map((category) =>
            category.id === id ? response.data : category
          )
        );
        setEditingCategory(null);
        setEditCategoryName('');
        alert('카테고리 수정 완료');
      } else {
        alert('카테고리 수정 실패');
      }
    } catch (error) {
      console.error(error);
      alert('카테고리 수정 실패');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response: ProcessedApiResponse<Boolean> = await deleteCategory(id);
      if (response.success) {
        setCategories(categories.filter((category) => category.id !== id));
        alert(`카테고리 삭제 완료 : ${id}`);
      } else {
        alert(`카테고리 삭제 실패 : ${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeCategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const onSubmitCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  useEffect(() => {
    // checkUserRole();
  }, []);

  return (
    <div>
      this is adminPage
      <form onSubmit={onSubmitCategory}>
        <InputForm
          type="text"
          value={categoryName}
          onChange={onChangeCategoryName}
          placeholder="카테고리 이름"
        />
        <button type="submit">카테고리 추가</button>
      </form>
      <div>
        <h1>카테고리 목록</h1>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              {editingCategory === category.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(category.id);
                  }}
                >
                  <InputForm
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <button type="submit">저장</button>
                  <button onClick={() => setEditingCategory(null)}>취소</button>
                </form>
              ) : (
                <>
                  {category.id} : {category.categoryName}
                  <button
                    onClick={() => {
                      setEditingCategory(category.id);
                      setEditCategoryName(category.categoryName);
                    }}
                  >
                    수정
                  </button>
                  <button onClick={() => handleDelete(category.id)}>
                    삭제
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPageClient;
