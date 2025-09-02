'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { useGlobalAlert } from '@/providers/AlertProvider';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  onImageUpdate?: (imageFile: File) => Promise<boolean>;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  padding: 1rem;
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: ${palette.shadow};
  transform: ${(props) =>
    props.$isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'};
  transition: all 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${palette.textMuted};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${palette.input};
    color: ${palette.textPrimary};
  }
`;

const ImagePreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${palette.input};
  border: 3px solid ${palette.border};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${palette.accent};
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderIcon = styled.div`
  font-size: 2.5rem;
  color: ${palette.textMuted};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ImageInfo = styled.div`
  text-align: center;
  color: ${palette.textMuted};
  font-size: 0.85rem;
  line-height: 1.4;
`;

const UploadSection = styled.div`
  margin-bottom: 2rem;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: 2px dashed ${palette.border};
  border-radius: 12px;
  background: ${palette.input};
  color: ${palette.textSecondary};
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${palette.accent};
    background: ${palette.card};
    color: ${palette.textPrimary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UploadIcon = styled.div`
  font-size: 1.5rem;
  color: ${palette.accent};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;

  ${(props) => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${palette.accent};
          color: white;
          
          &:hover:not(:disabled) {
            background: #e6c200;
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          
          &:hover:not(:disabled) {
            background: #dc2626;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: ${palette.input};
          color: ${palette.textSecondary};
          border: 1px solid ${palette.border};
          
          &:hover:not(:disabled) {
            background: ${palette.border};
            color: ${palette.textPrimary};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-width: unset;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ef4444;
`;

const NoticeMessage = styled.div`
  color: ${palette.textMuted};
  font-size: 0.85rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${palette.input};
  border-radius: 8px;
  border-left: 3px solid ${palette.accent};
  line-height: 1.4;
`;

export default function ProfileImageModal({
  isOpen,
  onClose,
  currentImage,
  onImageUpdate,
}: ProfileImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 전역 알림 훅
  const { showInfo } = useGlobalAlert();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setSelectedFile(file);

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    if (onImageUpdate) {
      // API 연동이 구현되면 여기서 호출
      // const success = await onImageUpdate(selectedFile);
      // if (success) {
      //   onClose();
      // }
    }

    // 현재는 API가 없으므로 알림만 표시
    showInfo('프로필 이미지 변경 API가 준비 중입니다.');
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer $isOpen={isOpen}>
        <ModalHeader>
          <ModalTitle>프로필 이미지 변경</ModalTitle>
          <CloseButton onClick={handleClose}>✕</CloseButton>
        </ModalHeader>

        <ImagePreviewSection>
          <ImagePreview>
            {displayImage ? (
              <PreviewImage src={displayImage} alt="프로필 미리보기" />
            ) : (
              <PlaceholderIcon>👤</PlaceholderIcon>
            )}
          </ImagePreview>
          <ImageInfo>
            {selectedFile ? (
              <>
                <div>
                  <strong>{selectedFile.name}</strong>
                </div>
                <div>{(selectedFile.size / 1024 / 1024).toFixed(2)}MB</div>
              </>
            ) : (
              <div>현재 프로필 이미지</div>
            )}
          </ImageInfo>
        </ImagePreviewSection>

        <UploadSection>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileSelect}
          />
          <UploadButton onClick={handleUploadClick}>
            <UploadIcon>📁</UploadIcon>
            <div>이미지 선택하기</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              JPG, PNG, WebP (최대 5MB)
            </div>
          </UploadButton>
        </UploadSection>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <NoticeMessage>
          💡 프로필 이미지 변경 기능은 현재 개발 중입니다. 곧 사용할 수 있도록
          준비하고 있어요!
        </NoticeMessage>

        <ButtonGroup>
          <Button onClick={handleClose}>취소</Button>
          {selectedFile && (
            <Button $variant="danger" onClick={handleRemoveImage}>
              제거
            </Button>
          )}
          <Button
            $variant="primary"
            onClick={handleSave}
            disabled={!selectedFile}
          >
            저장하기
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ModalOverlay>
  );
}
