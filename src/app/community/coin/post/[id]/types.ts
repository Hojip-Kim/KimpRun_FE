export interface Comment {
  id: number;
  parentCommentId: number | null;
  content: string | null;
  depth: number;
  email: string;
  nickName: string;
  memberId?: number;
  profileImageUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  children?: Comment[];
}

export interface BoardData {
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
  createdAt: string | Date;
  updatedAt: string | Date;
  commentsCount: number;
  isPin: boolean;
  comments: Comment[];
}
