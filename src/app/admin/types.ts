// 카테고리 타입
export interface Category {
  id: number;
  categoryName: string;
  description?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

// 배치 관리 타입
export interface JobExecutionInfo {
  jobExecutionId: number;
  jobInstanceId: number;
  status: string;
  startTime: string;
  endTime?: string;
  exitCode?: string;
  parameters?: Record<string, any>;
  runningSteps?: string[];
}

export interface StepExecutionInfo {
  status: string;
  readCount: number;
  writeCount: number;
  commitCount: number;
  rollbackCount: number;
  filterCount: number;
  startTime: string;
  endTime?: string;
  exitCode?: string;
}

export interface BatchJobStatus {
  stepExecutions: Record<string, StepExecutionInfo>;
}

export interface BatchJobHistory {
  totalCount: number;
  executions: JobExecutionInfo[];
}

export interface RunningJobs {
  runningJobsCount: number;
  runningJobs: JobExecutionInfo[];
}

export interface BatchHealth {
  message: string;
  jobRepositoryConnected: boolean;
  targetJobExists: boolean;
  availableJobs: string[];
  timestamp: string;
}

export interface RateLimitStatus {
  currentUsage: number;
  limit: number;
  windowSeconds: number;
  timestamp: string;
}

export interface CmcApiStatus {
  status: string;
  timestamp: string;
}

// 채팅 관리 타입
export interface ChatLog {
  id: number;
  message: string;
  nickname: string;
  isAuth: boolean;
  uuid?: string;
  memberId?: number;
  createdAt: string;
  isDeleted: boolean;
}

export interface ChatLogPage {
  content: ChatLog[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 인증 관리 타입
export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  role: string;
  provider: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  uuid?: string;
  user?: UserInfo;
}

// 대시보드 타입
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
  totalCategories: number;
  runningBatchJobs: number;
  recentChatMessages: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

export interface RecentActivity {
  id: number;
  type: 'user' | 'post' | 'comment' | 'batch' | 'chat';
  description: string;
  timestamp: string;
  status?: string;
}

export interface SystemMetrics {
  cpuUsage?: number;
  memoryUsage?: number;
  activeConnections?: number;
  requestsPerMinute?: number;
}

// 사용자 관리 타입
export interface UserListItem {
  id: number;
  email: string;
  nickname: string;
  name?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListPage {
  content: UserListItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type UserRoleType = 'USER' | 'INFLUENCER' | 'MANAGER' | 'OPERATOR';
export type UserRoleFullType = 'ROLE_USER' | 'ROLE_INFLUENCER' | 'ROLE_MANAGER' | 'ROLE_OPERATOR';

export interface UserDetailInfo {
  email: string;
  nickname: string;
  role: UserRoleFullType;
}

export interface RoleInfo {
  id: number;
  roleKey: string;
  roleName: UserRoleFullType;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRoleRequest {
  userId: number;
  role: UserRoleType;
}

export interface DeleteUserRequest {
  userId: number;
}

export interface CreateRoleRequest {
  roleKey: string;
  roleName: string;
}

export interface UpdateRoleRequest {
  roleId: number;
  roleName: string;
}

// 신고 관리 타입
export interface DeclarationItem {
  fromMember: string;
  toMember: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeclarationPage {
  content: DeclarationItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 채팅 관리 타입
export interface ChatModeration {
  totalMessages: number;
  deletedMessages: number;
  activeUsers: number;
  guestUsers: number;
}

export interface DeleteChatRequest {
  inherenceId: number;
}

// 게시판 관리 타입
export interface BoardItem {
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

export interface BoardPage {
  content: BoardItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface BoardStats {
  totalBoards: number;
  activeBoards: number;
  deletedBoards: number;
  pinnedBoards: number;
  totalViews: number;
  totalLikes: number;
}

export interface PinBoardRequest {
  boardIds: number[];
}

export interface BatchHardDeleteRequest {
  beforeDate: string; // ISO 8601 format
  batchSize: number;
  boardOnly: boolean;
  commentOnly: boolean;
  executeDelete: boolean;
}

export interface BatchHardDeleteResponse {
  deletedBoardCount: number;
  deletedCommentCount: number;
  processingTimeMs: number;
  executedAt: string;
}

// 댓글 관리 타입
export interface CommentItem {
  id: number;
  parentCommentId: number;
  content: string;
  depth: number;
  email: string;
  nickName: string;
  createdAt: string;
  updatedAt: string;
  boardId?: number;
  boardTitle?: string;
  memberId?: number;
  likes?: number;
}

export interface CommentPage {
  content: CommentItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface CommentStats {
  totalComments: number;
  deletedComments: number;
  totalLikes: number;
  repliesCount: number;
}

// 전문가 관리 타입
export interface ExpertApplicationItem {
  id: number;
  memberId: number;
  memberNickname: string;
  expertiseField: string;
  description: string;
  credentials: string;
  portfolioUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  statusDescription: string;
  rejectionReason?: string;
  reviewedBy?: number;
  reviewerNickname?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpertProfileItem {
  id: number;
  memberId: number;
  memberNickname: string;
  applicationId: number;
  expertiseField: string;
  bio: string;
  portfolioUrl: string;
  isActive: boolean;
  articlesCount: number;
  followersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExpertApplicationPage {
  content: ExpertApplicationItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ExpertProfilePage {
  content: ExpertProfileItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ApproveApplicationRequest {
  applicationId: number;
}

export interface RejectApplicationRequest {
  applicationId: number;
  rejectionReason: string;
}

// 관리자 탭 타입
export type AdminTab = 'dashboard' | 'batch' | 'chat' | 'auth' | 'category' | 'community';

export type CommunitySubTab = 'boards' | 'comments' | 'experts';

export interface AdminTabInfo {
  id: AdminTab;
  label: string;
  icon: string;
  description: string;
}

export const ADMIN_TABS: AdminTabInfo[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: '📊',
    description: '시스템 전체 현황',
  },
  {
    id: 'batch',
    label: 'Batch 관리',
    icon: '⚙️',
    description: 'CMC 배치 작업 관리',
  },
  {
    id: 'chat',
    label: 'Chat 관리',
    icon: '💬',
    description: '채팅 로그 및 모더레이션',
  },
  {
    id: 'auth',
    label: 'Auth 관리',
    icon: '🔐',
    description: '사용자 및 권한 관리',
  },
  {
    id: 'community',
    label: 'Community 관리',
    icon: '📝',
    description: '게시물 및 댓글 관리',
  },
  {
    id: 'category',
    label: '카테고리',
    icon: '📁',
    description: '게시판 카테고리 관리',
  },
];
