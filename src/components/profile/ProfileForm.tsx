'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUser } from '@/redux/reducer/authReducer';
import { clientEnv } from '@/utils/env';
import { updateNickname } from './server/profileDataFetch';
import { clientRequest } from '@/server/fetch';

const userInfoUrl = clientEnv.USER_INFO_URL;
const updateNicknameUrl = clientEnv.UPDATE_NICKNAME_URL;

interface UserInfo {
  email: string;
  nickname: string;
  role: string;
}

interface ProfileFormProps {
  closeModal: () => void;
  setModalSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  closeModal,
  setModalSize,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    nickname: '',
    role: '',
  });

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await clientRequest.get<UserInfo>(userInfoUrl, {
        credentials: 'include',
      });

      if (response.success && response.data) {
        setUserInfo(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch user info');
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
    }
  };

  const handleUpdateNickname = async () => {
    const newNickname = prompt('새로운 닉네임을 입력하세요:');
    if (newNickname) {
      try {
        const updatedUserInfo = await updateNickname(
          updateNicknameUrl,
          newNickname
        );

        if (updatedUserInfo && updatedUserInfo.result === 'success') {
          const newUserInfo: UserInfo = {
            email: userInfo.email,
            nickname: newNickname,
            role: userInfo.role,
          };

          setUserInfo(newUserInfo);

          // Redux 상태도 업데이트
          if (user) {
            dispatch(setUser({ ...user, name: newNickname }));
          }

          alert('닉네임 변경 성공');
        } else {
          alert('닉네임 변경 실패');
        }
      } catch (error) {
        console.error('닉네임 변경 오류:', error);
        alert('닉네임 변경 중 오류 발생');
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  return (
    <div>
      <div>
        <h1>user name : {userInfo.nickname}</h1>
        <button onClick={handleUpdateNickname}>닉네임 변경</button>
      </div>
      <p>user email : {userInfo.email}</p>
      <p>user role : {userInfo.role}</p>
    </div>
  );
};

export default ProfileForm;
