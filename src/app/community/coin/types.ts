import { CustomException } from '@/types/exception';

export type Post = {
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
};

export type GetPostResponse = {
  boardResponseDtos: Post[];
  count: number;
};
