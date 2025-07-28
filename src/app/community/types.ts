import { Category } from '../admin/type';
import { Post } from './coin/types';

export interface CommunityPageProps {
  initialCategories: Category[];
  initialAllPosts: AllPostData;
}

export interface AllPostData {
  boards: Post[];
  boardCount: number;
}
