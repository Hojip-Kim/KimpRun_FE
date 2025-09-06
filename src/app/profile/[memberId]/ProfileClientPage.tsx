'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  ProfileInfo,
  ProfileTab,
  UserPost,
  UserComment,
  FollowerInfo,
  FollowingInfo,
} from '@/types/profile';
import { PageResponse } from '@/types/page';
import { profileClientApi } from '@/server/profile/profileApi';
import { useGlobalAlert } from '@/providers/AlertProvider';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import ProfileContent from './components/ProfileContent';
import dynamic from 'next/dynamic';

const DeleteAccountModal = dynamic(() => import('./components/DeleteAccountModal'), { ssr: false });
const PasswordChangeModal = dynamic(() => import('./components/PasswordChangeModal'), { ssr: false });
import {
  ProfileContainer,
  ProfileWrapper,
  DeleteAccountSection,
  DeleteAccountButton,
} from './styles';
import { ProfileSkeleton } from '@/components/skeleton/Skeleton';

interface ProfileClientPageProps {
  profileInfo: ProfileInfo;
  initialData: PageResponse<
    UserPost | UserComment | FollowerInfo | FollowingInfo
  > | null;
  initialTab: ProfileTab;
  initialPage: number;
  memberId: number;
}

export default function ProfileClientPage({
  profileInfo,
  initialData,
  initialTab,
  initialPage,
  memberId,
}: ProfileClientPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const { showError, showSuccess, showWarning } = useGlobalAlert();

  const [currentTab, setCurrentTab] = useState<ProfileTab>(initialTab);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(profileInfo.followerCount);
  const [currentProfileInfo, setCurrentProfileInfo] = useState(profileInfo);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);

  // 현재 사용자가 프로필 소유자인지 확인
  const isOwnProfile = isAuthenticated && currentUser?.memberId === memberId;

  // 프로필 정보 업데이트 핸들러
  const handleProfileUpdate = (updatedProfile: Partial<ProfileInfo>) => {
    setCurrentProfileInfo((prev) => ({ ...prev, ...updatedProfile }));
  };

  // 다른 사람의 프로필에서 댓글 탭에 접근하려고 하면 게시물 탭으로 리다이렉트
  useEffect(() => {
    if (!isOwnProfile && currentTab === 'comments') {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', 'posts');
      params.delete('page');
      router.replace(`/profile/${memberId}?${params.toString()}`);
      setCurrentTab('posts');
    }
  }, [isOwnProfile, currentTab, memberId, router]);

  // 팔로우 상태 확인
  useEffect(() => {
    if (isAuthenticated && !isOwnProfile) {
      checkFollowStatus();
    }
  }, [isAuthenticated, isOwnProfile, memberId]);

  const checkFollowStatus = async () => {
    try {
      const followStatus = await profileClientApi.getFollowStatus(memberId);
      setIsFollowing(followStatus);
    } catch (error) {
      console.error('팔로우 상태 확인 오류:', error);
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = async (tab: ProfileTab) => {
    if (tab === currentTab) return;

    setCurrentTab(tab);

    switch (tab) {
      case 'posts':
        setCurrentPage(1);
        break;
      case 'comments':
        setCurrentPage(1);
        break;
      case 'followers':
        setCurrentPage(0);
        break;
      case 'following':
        setCurrentPage(0);
        break;
    }

    setIsLoading(true);

    try {
      let newData = null;

      switch (tab) {
        case 'posts':
          newData = await profileClientApi.getUserPosts(memberId, 1);
          break;
        case 'comments':
          newData = await profileClientApi.getUserComments(memberId, 1);
          break;
        case 'followers':
          newData = await profileClientApi.getFollowers(memberId, 0);
          break;
        case 'following':
          newData = await profileClientApi.getFollowing(memberId, 0);
          break;
      }

      setData(newData);

      // URL 업데이트
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      params.delete('page');
      router.push(`/profile/${memberId}?${params.toString()}`, {
        scroll: false,
      });
    } catch (error) {
      console.error('탭 데이터 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;

    setCurrentPage(page);
    setIsLoading(true);

    try {
      let newData = null;

      switch (currentTab) {
        case 'posts':
          newData = await profileClientApi.getUserPosts(memberId, page);
          break;
        case 'comments':
          newData = await profileClientApi.getUserComments(memberId, page);
          break;
        case 'followers':
          newData = await profileClientApi.getFollowers(memberId, page);
          break;
        case 'following':
          newData = await profileClientApi.getFollowing(memberId, page);
          break;
      }

      setData(newData);

      // URL 업데이트
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`/profile/${memberId}?${params.toString()}`, {
        scroll: false,
      });
    } catch (error) {
      console.error('페이지 데이터 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 팔로우/언팔로우 핸들러
  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      showWarning('로그인이 필요합니다.');
      return;
    }

    if (isOwnProfile) return;

    try {
      const result = isFollowing
        ? await profileClientApi.unfollow(memberId)
        : await profileClientApi.follow(memberId);

      if (result.success) {
        setIsFollowing(!isFollowing);
        setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));

        if (result.message) {
          showSuccess(result.message);
        }
      } else {
        showError(result.message || '요청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('팔로우 토글 오류:', error);
      showError('요청 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <ProfileContainer>
      <ProfileWrapper>
        <ProfileHeader
          profileInfo={{
            ...currentProfileInfo,
            followerCount,
          }}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          isAuthenticated={isAuthenticated}
          onProfileUpdate={handleProfileUpdate}
        />

        <ProfileTabs
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isLoading={isLoading}
          isOwnProfile={isOwnProfile}
        />

        <ProfileContent
          currentTab={currentTab}
          data={data}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          memberId={memberId}
          isOwnProfile={isOwnProfile}
        />

        {isOwnProfile && (
          <DeleteAccountSection>
            <DeleteAccountButton 
              onClick={() => setIsPasswordChangeModalOpen(true)}
              style={{ 
                backgroundColor: '#3b82f6', 
                marginRight: '1rem',
                color: 'white',
                border: '1px solid #3b82f6'
              }}
            >
              비밀번호 변경
            </DeleteAccountButton>
            <DeleteAccountButton onClick={() => setIsDeleteModalOpen(true)}>
              회원탈퇴
            </DeleteAccountButton>
          </DeleteAccountSection>
        )}
      </ProfileWrapper>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      <PasswordChangeModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
      />
    </ProfileContainer>
  );
}
