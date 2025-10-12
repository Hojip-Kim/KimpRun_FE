export interface ProfileInfo {
  memberId: number;
  nickname: string;
  email: string;
  role: string;
  profileImageUrl: string;
  seedMoneyRange: string;
  activityRankGrade: string;
  joinedAt: string;
  declarationCount: number;
  followerCount: number;
  followingCount: number;
}

export interface FollowerInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  followedAt: string;
}

export interface FollowingInfo {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  followedAt: string;
}

export interface FollowRequest {
  followingId: number;
}

export interface FollowStatus {
  isFollowing: boolean;
}

export interface UserPost {
  boardId: number;
  memberId: number;
  categoryId: number;
  categoryName: string;
  memberNickName: string;
  title: string;
  content: string;
  boardViewsCount: number;
  boardLikesCount: number;
  createdAt: string;
  updatedAt: string;
  commentsCount: number;
  isPin: boolean;
}

export interface UserComment {
  id: number;
  parentCommentId?: number;
  content: string;
  depth?: number;
  email?: string;
  nickName: string;
  createdAt: string;
  updatedAt: string;
  // 유저별 댓글 조회용 추가 필드들
  boardId: number;
  boardTitle: string;
  memberId: number;
  likes: number;
}

export type ProfileTab = 'posts' | 'comments' | 'followers' | 'following';
