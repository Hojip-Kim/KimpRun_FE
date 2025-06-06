import { CustomException } from '@/types/exception';

export interface Post {
  boardId: number;
  memberId: number;
  categoryId: number;
  categoryName: string;
  memberNickName: string;
  title: string;
  content: string;
  boardViewsCount: number;
  boardLikesCount: number;
  createdAt: Date;
  updatedAt: Date;
  commentsCount: number;
}

export interface ErrorResponse {
  satus: number;
  error: string;
  message: string;
  trace?: string;
};
