import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileInfo } from '@/types/profile';
import { RootState } from '@/redux/store';
import { setUser } from '@/redux/reducer/authReducer';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { formatDateWithDaysAgo } from '@/utils/dateUtils';
import {
  ProfileHeaderCard,
  ProfileHeaderTop,
  ProfileAvatar,
  ProfileInfo as StyledProfileInfo,
  ProfileNameSection,
  ProfileName,
  ProfileBadge,
  FollowButton,
  ProfileStats,
  ProfileStat,
  ProfileStatNumber,
  ProfileStatLabel,
  ProfileDetails,
  ProfileDetail,
  ProfileDetailLabel,
  ProfileDetailValue,
  EditButtonGroup,
  EditButton,
  AvatarContainer,
  EditAvatarOverlay,
} from '../styles';
import dynamic from 'next/dynamic';
import { updateNickname } from '../api/profileApi';

const EditProfileModal = dynamic(() => import('./EditProfileModal'), { ssr: false });
const ProfileImageModal = dynamic(() => import('./ProfileImageModal'), { ssr: false });

interface ProfileHeaderProps {
  profileInfo: ProfileInfo;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
  isAuthenticated: boolean;
  onProfileUpdate?: (updatedProfile: Partial<ProfileInfo>) => void;
}

export default function ProfileHeader({
  profileInfo,
  isOwnProfile,
  isFollowing,
  onFollowToggle,
  isAuthenticated,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { showError } = useGlobalAlert();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleNicknameUpdate = async (
    newNickname: string
  ): Promise<boolean> => {
    try {
      const result = await updateNickname(newNickname);
      if (result && onProfileUpdate) {
        // 프로필 정보 업데이트
        onProfileUpdate({
          nickname: result.name,
          email: result.email,
          role: result.role,
        });

        // 자신의 프로필이면 Redux 스토어도 업데이트
        if (isOwnProfile && currentUser) {
          const updatedUser = {
            ...currentUser,
            name: result.name,
            email: result.email,
            role: result.role,
            memberId: result.memberId,
          };
          dispatch(setUser(updatedUser));
        }

        return true;
      }
      return false;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === '이미 사용 중인 닉네임입니다.'
      ) {
        showError(
          '이미 다른 사용자가 사용 중인 닉네임입니다.\n다른 닉네임을 선택해주세요.',
          {
            title: '닉네임 변경 실패',
          }
        );
        return false;
      }

      console.error('닉네임 변경 오류:', error);
      return false;
    }
  };

  const handleImageUpdate = async (_imageFile: File): Promise<boolean> => {
    // API가 준비되면 구현
    return false;
  };


  const getRoleBadge = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return { variant: 'admin' as const, text: '관리자' };
      case 'PREMIUM':
        return { variant: 'premium' as const, text: '프리미엄' };
      default:
        return { variant: 'normal' as const, text: '일반' };
    }
  };

  const roleBadge = getRoleBadge(profileInfo.role);

  return (
    <>
      <ProfileHeaderCard>
        <ProfileHeaderTop>
          <AvatarContainer>
            <ProfileAvatar>
              {profileInfo.profileImageUrl ? (
                <img
                  src={profileInfo.profileImageUrl}
                  alt={profileInfo.nickname}
                />
              ) : (
                profileInfo.nickname.charAt(0).toUpperCase()
              )}
            </ProfileAvatar>
            {isOwnProfile && (
              <EditAvatarOverlay onClick={() => setIsImageModalOpen(true)}>
                📷
              </EditAvatarOverlay>
            )}
          </AvatarContainer>

          <StyledProfileInfo>
            <ProfileNameSection>
              <ProfileName>{profileInfo.nickname}</ProfileName>
              {isOwnProfile && (
                <EditButton
                  onClick={() => setIsEditModalOpen(true)}
                  title="닉네임 편집"
                >
                  ✏️
                </EditButton>
              )}
              <ProfileBadge $variant={roleBadge.variant}>
                {roleBadge.text}
              </ProfileBadge>
              {profileInfo.activityRankGrade && (
                <ProfileBadge>{profileInfo.activityRankGrade}</ProfileBadge>
              )}
            </ProfileNameSection>

            {!isOwnProfile && isAuthenticated && (
              <FollowButton $isFollowing={isFollowing} onClick={onFollowToggle}>
                {isFollowing ? '팔로우 취소' : '팔로우'}
              </FollowButton>
            )}

            <ProfileStats>
              <ProfileStat>
                <ProfileStatNumber>
                  {profileInfo.followerCount}
                </ProfileStatNumber>
                <ProfileStatLabel>팔로워</ProfileStatLabel>
              </ProfileStat>
              <ProfileStat>
                <ProfileStatNumber>
                  {profileInfo.followingCount}
                </ProfileStatNumber>
                <ProfileStatLabel>팔로잉</ProfileStatLabel>
              </ProfileStat>
              {profileInfo.declarationCount > 0 && (
                <ProfileStat>
                  <ProfileStatNumber>
                    {profileInfo.declarationCount}
                  </ProfileStatNumber>
                  <ProfileStatLabel>신고</ProfileStatLabel>
                </ProfileStat>
              )}
            </ProfileStats>
          </StyledProfileInfo>
        </ProfileHeaderTop>

        <ProfileDetails>
          {isOwnProfile && (
            <ProfileDetail>
              <ProfileDetailLabel>이메일</ProfileDetailLabel>
              <ProfileDetailValue>{profileInfo.email}</ProfileDetailValue>
            </ProfileDetail>
          )}

          {profileInfo.seedMoneyRange && (
            <ProfileDetail>
              <ProfileDetailLabel>시드머니</ProfileDetailLabel>
              <ProfileDetailValue>
                {profileInfo.seedMoneyRange}
              </ProfileDetailValue>
            </ProfileDetail>
          )}

          <ProfileDetail>
            <ProfileDetailLabel>가입일</ProfileDetailLabel>
            <ProfileDetailValue>
              {formatDateWithDaysAgo(profileInfo.joinedAt).date}
              <span
                style={{
                  fontSize: '0.85em',
                  opacity: 0.6,
                  marginLeft: '8px',
                  color: 'inherit',
                }}
              >
                {formatDateWithDaysAgo(profileInfo.joinedAt).daysAgo}일전
              </span>
            </ProfileDetailValue>
          </ProfileDetail>

          <ProfileDetail>
            <ProfileDetailLabel>등급</ProfileDetailLabel>
            <ProfileDetailValue>
              {profileInfo.activityRankGrade || '없음'}
            </ProfileDetailValue>
          </ProfileDetail>
        </ProfileDetails>
      </ProfileHeaderCard>

      {/* 편집 모달들 */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentNickname={profileInfo.nickname}
        onNicknameUpdate={handleNicknameUpdate}
      />

      <ProfileImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentImage={profileInfo.profileImageUrl}
        onImageUpdate={handleImageUpdate}
      />
    </>
  );
}
