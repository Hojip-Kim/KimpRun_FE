'use client';

import React from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

interface ProfileImageProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const ProfileImageContainer = styled.div<{
  $size: number;
  $clickable: boolean;
}>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: ${palette.card};
  border: 2px solid ${palette.border};
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      props.$clickable &&
      `
      transform: scale(1.05);
      border-color: ${palette.accent};
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `}
  }

  &:active {
    ${(props) => props.$clickable && 'transform: scale(0.98);'}
  }
`;

const Image = styled.img<{ $size: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const DefaultAvatar = styled.div<{ $size: number }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${palette.card};
`;

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  size = 32,
  className,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <ProfileImageContainer
      $size={size}
      $clickable={!!onClick}
      className={className}
      onClick={onClick}
    >
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          $size={size}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      ) : (
        <DefaultAvatar $size={size}>
          <Image
            src="/logo.png"
            alt="Default Profile"
            $size={size}
            onError={() => {}} // logo.png 에러 시에도 표시
          />
        </DefaultAvatar>
      )}
    </ProfileImageContainer>
  );
};

export default ProfileImage;
