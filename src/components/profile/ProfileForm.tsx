'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUser } from '@/redux/reducer/authReducer';
import { clientEnv } from '@/utils/env';
import { updateNickname } from './server/profileDataFetch';
import { clientRequest } from '@/server/fetch';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import NicknameModal from './NicknameModal';

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

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid ${palette.border};
  border-radius: 10px;
  background: ${palette.input};
  color: ${palette.textPrimary};
`;

const Label = styled.span`
  color: ${palette.textSecondary};
  font-size: 12px;
`;

const Value = styled.span`
  color: ${palette.textPrimary};
  font-weight: 600;
`;

const Action = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${palette.border};
  background: #171b24;
  color: ${palette.textPrimary};
  cursor: pointer;
  &:hover {
    color: ${palette.accent};
    background-color: #131722;
  }
`;

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
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await clientRequest.get<UserInfo>(userInfoUrl, {
        credentials: 'include',
        cache: 'no-store',
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

  const handleSaveNickname = async (newNickname: string) => {
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
        if (user) dispatch(setUser({ ...user, name: newNickname }));
        setIsNicknameOpen(false);
      } else {
        alert('닉네임 변경 실패');
      }
    } catch (error) {
      console.error('닉네임 변경 오류:', error);
      if (error instanceof Error && error.message.includes('400')) {
        alert(
          '이미 다른 사용자가 사용 중인 닉네임입니다.\n다른 닉네임을 선택해주세요.'
        );
      } else {
        alert('닉네임 변경 중 오류 발생');
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  return (
    <Card>
      <Row>
        <div>
          <Label>닉네임</Label>
          <div>
            <Value>{userInfo.nickname}</Value>
          </div>
        </div>
        <Action onClick={() => setIsNicknameOpen(true)}>닉네임 변경</Action>
      </Row>
      <Row>
        <div>
          <Label>이메일</Label>
          <div>
            <Value>{userInfo.email}</Value>
          </div>
        </div>
      </Row>
      <Row>
        <div>
          <Label>권한</Label>
          <div>
            <Value>{userInfo.role}</Value>
          </div>
        </div>
      </Row>

      {isNicknameOpen && (
        <NicknameModal
          initialName={userInfo.nickname}
          onCancel={() => setIsNicknameOpen(false)}
          onSave={handleSaveNickname}
        />
      )}
    </Card>
  );
};

export default ProfileForm;
