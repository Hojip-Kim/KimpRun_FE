'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

interface NicknameModalProps {
  initialName?: string;
  onCancel: () => void;
  onSave: (newName: string) => Promise<void> | void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 6px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: ${palette.textPrimary};
  letter-spacing: 0.2px;
`;

const TitleIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${palette.accentRing};
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  &::before {
    content: '✍️';
  }
`;

const Subtext = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${palette.textMuted};
`;

const Label = styled.label`
  font-size: 12px;
  color: ${palette.textSecondary};
  margin-bottom: 6px;
  display: inline-block;
`;

const InputWrap = styled.div<{ $invalid?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid
    ${(p) => (p.$invalid ? 'rgba(244, 67, 54, 0.45)' : palette.border)};
  border-radius: 12px;
  background: ${palette.input};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus-within {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: ${palette.textPrimary};
  outline: none;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${palette.border};
  background: ${(p) =>
    p.$variant === 'primary' ? palette.input : 'transparent'};
  color: ${(p) =>
    p.$variant === 'primary' ? palette.textPrimary : palette.textSecondary};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  &:hover {
    color: ${palette.accent};
    background-color: ${palette.input};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Hint = styled.p`
  margin: 6px 0 0 0;
  font-size: 12px;
  color: ${palette.textMuted};
`;

const ErrorText = styled.p`
  margin: 6px 0 0 0;
  font-size: 12px;
  color: #ff8a80;
`;

const NicknameModal: React.FC<NicknameModalProps> = ({
  initialName = '',
  onCancel,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  useEffect(() => setName(initialName), [initialName]);

  const valid = name.trim().length >= 2 && name.trim().length <= 16;

  const handleSave = async () => {
    if (!valid || saving) return;
    setSaving(true);
    await onSave(name.trim());
    setSaving(false);
  };

  return (
    <Wrapper>
      <Header>
        <TitleIcon />
        <div>
          <Title>닉네임 변경</Title>
          <Subtext>
            공개 표시되는 이름이에요. 언제든 다시 바꿀 수 있어요.
          </Subtext>
        </div>
      </Header>
      <div>
        <Label htmlFor="nickname">새 닉네임</Label>
        <InputWrap $invalid={!valid && name.trim().length > 0}>
          <Input
            id="nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
            placeholder="2~16자 한글/영문/숫자"
            autoFocus
          />
        </InputWrap>
        {!valid && name.trim().length > 0 ? (
          <ErrorText>닉네임은 2~16자로 입력해주세요.</ErrorText>
        ) : (
          <Hint>변경 후 바로 적용됩니다.</Hint>
        )}
      </div>
      <Actions>
        <Button onClick={onCancel}>취소</Button>
        <Button
          $variant="primary"
          onClick={handleSave}
          disabled={!valid || saving}
        >
          {saving ? '저장 중...' : '저장'}
        </Button>
      </Actions>
    </Wrapper>
  );
};

export default NicknameModal;
