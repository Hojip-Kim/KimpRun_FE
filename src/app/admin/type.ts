export interface Category {
  id: number;
  categoryName: string;
  description: string;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}
