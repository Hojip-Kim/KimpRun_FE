import { Post } from './coin/types';

export interface AllPostData {
  boardResponseDtos: Post[];
  count: number;
}

export interface CommunityPostResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // 현재 페이지 번호 (1-based)
  numberOfElements: number; // 현재 페이지의 요소 수
  first: boolean;
  last: boolean;
  empty: boolean;
  sort?: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
}

// 페이지네이션 파라미터
export interface CommunityPostParams {
  page?: number; // 1-based 페이지 번호
  size?: number; // 페이지 크기
  category?: string; // 카테고리 필터
}

// 에러 타입
export interface CommunityError {
  message: string;
  status?: number;
}
