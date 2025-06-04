'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  category,
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from './server/fetchCategory';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { redirect } from 'next/navigation';

const AdminPage = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categories, setCategories] = useState<category[]>([]);
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

  const fetchCategories = useCallback(async () => {
    const response: category[] = await getCategories();
    try {
      setCategories(response);
    } catch (error) {
      console.error(error);
      alert('카테고리 불러오기 실패');
    }
  }, []);

  const handleSubmit = async (formData: React.FormEvent<HTMLFormElement>) => {
    formData.preventDefault();
    try {
      const response: category = await createCategory(categoryName);
      fetchCategories();
      setCategoryName('');
      alert(`카테고리 추가 완료 : ${response.categoryName}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateCategory(id, editCategoryName);
      setEditingCategory(null);
      setEditCategoryName('');
      fetchCategories();
      alert('카테고리 수정 완료');
    } catch (error) {
      console.error(error);
      alert('카테고리 수정 실패');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const isDeleted = await deleteCategory(id);
      if (isDeleted) {
        alert(`카테고리 삭제 완료 : ${id}`);
        await fetchCategories();
      } else {
        alert(`카테고리 삭제 실패 : ${id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserRole();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      this is adminPage
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
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
                  <input
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

export default AdminPage;
