import { CustomException } from '@/types/exception';

export interface Post {
  boardId: number;
  memberId: number;
  categoryId: number;
  categoryName: string;
  memberNickName: string;
  profileImageUrl?: string;
  title: string;
  content: string;
  boardViewsCount: number;
  boardLikesCount: number;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  isPin: boolean;
}

export interface ErrorResponse {
  satus: number;
  error: string;
  message: string;
  trace?: string;
}
