import { serverRequest, clientRequest } from '@/server/fetch';
import {
  ProfileInfo,
  FollowerInfo,
  FollowingInfo,
  FollowRequest,
  FollowStatus,
  UserPost,
  UserComment,
} from '@/types/profile';
import { PageResponse } from '@/types/page';
import { serverEnv, clientEnv } from '@/utils/env';

// 서버사이드 API 함수들
export const profileServerApi = {
  // 프로필 정보 조회
  async getProfile(memberId: number): Promise<ProfileInfo | null> {
    try {
      const response = await serverRequest.get<ProfileInfo>(
        `/profile/${memberId}`,
        {
          cache: 'no-store',
        }
      );
      return response.success ? response.data : null;
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      return null;
    }
  },

  // 팔로워 목록 조회
  async getFollowers(
    memberId: number,
    page: number = 0,
    size: number = 15
  ): Promise<PageResponse<FollowerInfo> | null> {
    try {
      const url = `/profile/${memberId}/followers?page=${page}&size=${size}`;
      const response = await serverRequest.get<PageResponse<FollowerInfo>>(
        url,
        {
          cache: 'no-store',
        }
      );
      return response.success ? response.data : null;
    } catch (error) {
      console.error('팔로워 목록 조회 오류:', error);
      return null;
    }
  },

  // 팔로잉 목록 조회
  async getFollowing(
    memberId: number,
    page: number = 0,
    size: number = 15
  ): Promise<PageResponse<FollowingInfo> | null> {
    try {
      const url = `/profile/${memberId}/following?page=${page}&size=${size}`;
      const response = await serverRequest.get<PageResponse<FollowingInfo>>(
        url,
        {
          cache: 'no-store',
        }
      );
      return response.success ? response.data : null;
    } catch (error) {
      console.error('팔로잉 목록 조회 오류:', error);
      return null;
    }
  },

  // 유저별 게시물 조회
  async getUserPosts(
    memberId: number,
    page: number = 1,
    size: number = 15
  ): Promise<PageResponse<UserPost> | null> {
    try {
      const url = `/board/member/${memberId}?page=${page}&size=${size}`;
      const response = await serverRequest.get<PageResponse<UserPost>>(url, {
        cache: 'no-store',
      });
      return response.success ? response.data : null;
    } catch (error) {
      console.error('유저 게시물 조회 오류:', error);
      return null;
    }
  },

  // 유저별 댓글 조회
  async getUserComments(
    memberId: number,
    page: number = 1,
    size: number = 15
  ): Promise<PageResponse<UserComment> | null> {
    try {
      const url = `/board/member/${memberId}/comments?page=${page}&size=${size}`;
      const response = await serverRequest.get<PageResponse<UserComment>>(url, {
        cache: 'no-store',
      });
      return response.success ? response.data : null;
    } catch (error) {
      console.error('유저 댓글 조회 오류:', error);
      return null;
    }
  },
};

// 클라이언트사이드 API 함수들
export const profileClientApi = {
  // 프로필 정보 조회
  async getProfile(memberId: number): Promise<ProfileInfo | null> {
    try {
      const response = await clientRequest.get<ProfileInfo>(
        `/profile/${memberId}`,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );
      return response.success ? response.data : null;
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      return null;
    }
  },

  // 팔로우 하기
  async follow(
    followingId: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await clientRequest.post(
        `/profile/follow`,
        { followingId },
        { credentials: 'include' }
      );
      return {
        success: response.success,
        message: response.success
          ? '팔로우했습니다.'
          : '팔로우에 실패했습니다.',
      };
    } catch (error) {
      console.error('팔로우 오류:', error);
      return { success: false, message: '팔로우 요청 중 오류가 발생했습니다.' };
    }
  },

  // 언팔로우 하기
  async unfollow(
    followingId: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await clientRequest.delete(
        `/profile/follow/${followingId}`,
        {
          credentials: 'include',
        }
      );
      return {
        success: response.success,
        message: response.success
          ? '언팔로우했습니다.'
          : '언팔로우에 실패했습니다.',
      };
    } catch (error) {
      console.error('언팔로우 오류:', error);
      return {
        success: false,
        message: '언팔로우 요청 중 오류가 발생했습니다.',
      };
    }
  },

  // 팔로우 상태 확인
  async getFollowStatus(followingId: number): Promise<boolean> {
    try {
      const response = await clientRequest.get<boolean>(
        `/profile/follow-status/${followingId}`,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );
      return response.success ? response.data : false;
    } catch (error) {
      console.error('팔로우 상태 확인 오류:', error);
      return false;
    }
  },

  // 팔로워 목록 조회
  async getFollowers(
    memberId: number,
    page: number = 0,
    size: number = 15
  ): Promise<PageResponse<FollowerInfo> | null> {
    try {
      const url = `/profile/${memberId}/followers?page=${page}&size=${size}`;
      const response = await clientRequest.get<PageResponse<FollowerInfo>>(
        url,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );
      return response.success ? response.data : null;
    } catch (error) {
      console.error('팔로워 목록 조회 오류:', error);
      return null;
    }
  },

  // 팔로잉 목록 조회
  async getFollowing(
    memberId: number,
    page: number = 0,
    size: number = 15
  ): Promise<PageResponse<FollowingInfo> | null> {
    try {
      const url = `/profile/${memberId}/following?page=${page}&size=${size}`;
      const response = await clientRequest.get<PageResponse<FollowingInfo>>(
        url,
        {
          credentials: 'include',
          cache: 'no-store',
        }
      );
      return response.success ? response.data : null;
    } catch (error) {
      console.error('팔로잉 목록 조회 오류:', error);
      return null;
    }
  },

  // 유저별 게시물 조회
  async getUserPosts(
    memberId: number,
    page: number = 0,
    size: number = 15
  ): Promise<PageResponse<UserPost> | null> {
    try {
      const url = `/board/member/${memberId}?page=${page}&size=${size}`;
      const response = await clientRequest.get<PageResponse<UserPost>>(url, {
        credentials: 'include',
        cache: 'no-store',
      });
      return response.success ? response.data : null;
    } catch (error) {
      console.error('유저 게시물 조회 오류:', error);
      return null;
    }
  },

  // 유저별 댓글 조회
  async getUserComments(
    memberId: number,
    page: number = 1,
    size: number = 15
  ): Promise<PageResponse<UserComment> | null> {
    try {
      const url = `/board/member/${memberId}/comments?page=${page}&size=${size}`;
      const response = await clientRequest.get<PageResponse<UserComment>>(url, {
        credentials: 'include',
        cache: 'no-store',
      });
      return response.success ? response.data : null;
    } catch (error) {
      console.error('유저 댓글 조회 오류:', error);
      return null;
    }
  },
};
