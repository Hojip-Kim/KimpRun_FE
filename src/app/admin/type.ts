export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
}
