export interface Comment {
  id: number;
  parentCommentId: number | null;
  content: string;
  depth: number;
  email: string;
  nickName: string;
  createdAt: Date;
  updatedAt: Date;
  children?: Comment[];
}

export interface BoardData {
  boardId: number;
  userId: number;
  userNickName: string;
  title: string;
  content: string;
  boardViewsCount: number;
  boardLikesCount: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}
