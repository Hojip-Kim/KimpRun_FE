'use client';

import React, { useState } from 'react';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../server/fetchCategory';
import { ProcessedApiResponse } from '@/server/type';
import { Category } from '../types';
import {
  Card,
  CardHeader,
  CardTitle,
  InputForm,
  FormGroup,
  Label,
  Button,
  ButtonGroup,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from './style';
import { useGlobalAlert } from '@/providers/AlertProvider';

interface CategoryManagementProps {
  initialCategories: Category[];
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  initialCategories,
}) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>('');

  const { showError, showSuccess } = useGlobalAlert();

  const handleSubmit = async (formData: React.FormEvent<HTMLFormElement>) => {
    formData.preventDefault();

    if (!categoryName.trim()) {
      showError('카테고리 이름을 입력해주세요');
      return;
    }

    try {
      const response: ProcessedApiResponse<Category> =
        await createCategory({
          name: categoryName,
          description: '',
        });

      if (response.success && response.data) {
        const updatedCategories = [...categories, response.data];
        setCategories(updatedCategories);
        setCategoryName('');
        showSuccess('카테고리가 추가되었습니다');
      } else {
        showError('카테고리 추가 실패');
      }
    } catch (error) {
      console.error(error);
      showError('카테고리 추가 중 오류가 발생했습니다');
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editCategoryName.trim()) {
      showError('카테고리 이름을 입력해주세요');
      return;
    }

    try {
      const response: ProcessedApiResponse<Category> = await updateCategory(
        id,
        editCategoryName,
        ''
      );

      if (response.success && response.data) {
        const updatedCategories = categories.map((category) =>
          category.id === id ? response.data : category
        );
        setCategories(updatedCategories);
        setEditingCategory(null);
        setEditCategoryName('');
        showSuccess('카테고리가 수정되었습니다');
      } else {
        showError('카테고리 수정 실패');
      }
    } catch (error) {
      console.error(error);
      showError('카테고리 수정 중 오류가 발생했습니다');
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('정말로 이 카테고리를 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const response: ProcessedApiResponse<Boolean> = await deleteCategory(id);

      if (response.success) {
        const updatedCategories = categories.filter(
          (category) => category.id !== id
        );
        setCategories(updatedCategories);
        showSuccess('카테고리가 삭제되었습니다');
      } else {
        showError('카테고리 삭제 실패');
      }
    } catch (error) {
      console.error(error);
      showError('카테고리 삭제 중 오류가 발생했습니다');
    }
  };

  return (
    <div>
      {/* Add Category Form */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>➕ 새 카테고리 추가</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="categoryName">카테고리 이름</Label>
            <InputForm
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="카테고리 이름을 입력하세요"
            />
          </FormGroup>
          <Button type="submit">카테고리 추가</Button>
        </form>
      </Card>

      {/* Category List */}
      <Card>
        <CardHeader>
          <CardTitle>📁 카테고리 목록</CardTitle>
        </CardHeader>
        {categories.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>등록된 카테고리가 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>카테고리 이름</TableHeaderCell>
                <TableHeaderCell>설명</TableHeaderCell>
                <TableHeaderCell>관리</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>
                    {editingCategory === category.id ? (
                      <InputForm
                        type="text"
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        style={{ marginBottom: 0 }}
                      />
                    ) : (
                      category.categoryName
                    )}
                  </TableCell>
                  <TableCell>
                    {category.description || '-'}
                  </TableCell>
                  <TableCell>
                    {editingCategory === category.id ? (
                      <ButtonGroup>
                        <Button
                          variant="primary"
                          onClick={() => handleUpdate(category.id)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          저장
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingCategory(null);
                            setEditCategoryName('');
                          }}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          취소
                        </Button>
                      </ButtonGroup>
                    ) : (
                      <ButtonGroup>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingCategory(category.id);
                            setEditCategoryName(category.categoryName);
                          }}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          수정
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(category.id)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          삭제
                        </Button>
                      </ButtonGroup>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default CategoryManagement;
