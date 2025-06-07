import React from 'react';
import { fetchAllCategories } from './server/fetchCategory';
import { ApiResponse } from '@/server/type';
import { Category, CategoryResponse } from './type';
import AdminPageClient from './client/adminClient';
const AdminPage = async () => {
  const initialCategories: ApiResponse<CategoryResponse> =
    await fetchAllCategories();

  let parsedCategories: Category[] = [];

  if (initialCategories.status === 200) {
    parsedCategories = initialCategories.data.categories;
  } else {
    parsedCategories = [];
  }

  return <AdminPageClient initialCategories={parsedCategories} />;
};

export default AdminPage;
