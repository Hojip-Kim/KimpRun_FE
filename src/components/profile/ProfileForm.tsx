'use client';

import React, { useEffect, useState } from 'react';
import { updateNickname } from './server/profileDataFetch';
import { setUser } from '@/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { clientEnv } from '@/utils/env';

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
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    nickname: '',
    role: '',
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const userInfoUrl = clientEnv.USER_INFO_URL;
  const updateNicknameUrl = clientEnv.UPDATE_NICKNAME_URL;

  const fetchUserInfo = async (): Promise<void> => {
    const requestInit: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };

    const response = await fetch(userInfoUrl, requestInit);

    if (response.ok) {
      const data: UserInfo = await response.json();
      setUserInfo(data);
    } else {
      throw new Error('Failed to fetch user info');
    }
  };

  const handleUpdateNickname = async () => {
    const newNickname = prompt('새로운 닉네임을 입력하세요:');
    if (newNickname) {
      const updatedUserInfo = await updateNickname(
        updateNicknameUrl,
        newNickname
      );

      if (updatedUserInfo) {
        const newUserInfo: UserInfo = {
          email: updatedUserInfo.email,
          nickname: updatedUserInfo.name,
          role: updatedUserInfo.role,
        };

        setUserInfo(newUserInfo);

        dispatch(setUser(updatedUserInfo));

        alert('닉네임 변경 성공');
      } else {
        alert('닉네임 변경 실패');
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
