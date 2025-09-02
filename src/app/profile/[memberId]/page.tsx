import { notFound } from 'next/navigation';
import { profileServerApi } from '@/server/profile/profileApi';
import ProfileClientPage from '@/app/profile/[memberId]/ProfileClientPage';

interface ProfilePageProps {
  params: {
    memberId: string;
  };
  searchParams: {
    tab?: string;
    page?: string;
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const memberId = parseInt(params.memberId);
  const currentTab = (searchParams.tab as any) || 'posts';
  const currentPage = parseInt(searchParams.page || '1');

  if (isNaN(memberId)) {
    notFound();
  }

  // 프로필 정보 조회
  const profileInfo = await profileServerApi.getProfile(memberId);

  if (!profileInfo) {
    notFound();
  }

  // 탭에 따른 초기 데이터 로드
  let initialData = null;

  switch (currentTab) {
    case 'posts':
      initialData = await profileServerApi.getUserPosts(memberId, currentPage);
      break;
    case 'comments':
      initialData = await profileServerApi.getUserComments(
        memberId,
        currentPage
      );
      break;
    case 'followers':
      initialData = await profileServerApi.getFollowers(memberId, 0);
      break;
    case 'following':
      initialData = await profileServerApi.getFollowing(memberId, 0);
      break;
    default:
      initialData = await profileServerApi.getUserPosts(memberId, currentPage);
  }

  return (
    <ProfileClientPage
      profileInfo={profileInfo}
      initialData={initialData}
      initialTab={currentTab}
      initialPage={currentPage}
      memberId={memberId}
    />
  );
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const memberId = parseInt(params.memberId);

  if (isNaN(memberId)) {
    return {
      title: '프로필을 찾을 수 없습니다 - KimpRun',
    };
  }

  const profileInfo = await profileServerApi.getProfile(memberId);

  if (!profileInfo) {
    return {
      title: '프로필을 찾을 수 없습니다 - KimpRun',
    };
  }

  return {
    title: `${profileInfo.nickname}님의 프로필 - KimpRun`,
    description: `${profileInfo.nickname}님의 프로필을 확인하고 팔로우하세요. ${profileInfo.followerCount}명의 팔로워, ${profileInfo.followingCount}명 팔로우 중`,
  };
}
