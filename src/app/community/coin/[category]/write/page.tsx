'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FaEye, FaPencilAlt, FaCheck, FaImage } from 'react-icons/fa';
import type ReactQuill from 'react-quill';
import { clientEnv } from '@/utils/env';

const ReactQuillComponent = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    if (typeof window !== 'undefined') {
      const ImageResize = (await import('quill-image-resize')).default;
      RQ.Quill.register('modules/imageResize', ImageResize);
    }
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false }
);

import 'react-quill/dist/quill.snow.css';

const WritePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const quillRef = useRef<ReactQuill>(null);

  const pathname = usePathname();
  const router = useRouter();
  const categoryIdFromPath = pathname.split('/').slice(-2)[0];

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해주세요.');
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const extractedImages = extractImagesFromContent(content);
    setImages(extractedImages);
  }, [content]);

  const extractImagesFromContent = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const imgElements = doc.getElementsByTagName('img');
    return Array.from(imgElements).map((img) => img.src);
  };

  const boardUrl = clientEnv.BOARD_URL;

  const createPost = async () => {
    try {
      const response = await fetch(`${boardUrl}/${categoryIdFromPath}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title, content, previewImage: selectedImage }),
      });

      if (response.ok) {
        alert('게시글 작성 성공');
        window.location.href = `/community/coin/${categoryIdFromPath}/1`;
      } else {
        alert('게시글 작성실패');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', e.target?.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      imageResize: {
        displaySize: true,
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  return (
    <WritePostContainer>
      <Title>글 작성</Title>
      <form onSubmit={handleSubmit}>
        <TitleInput
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          required
        />
        {isPreview ? (
          <PreviewContainer>
            <h3>{title}</h3>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </PreviewContainer>
        ) : (
          <EditorContainer>
            <ReactQuillComponent
              forwardedRef={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              theme="snow"
            />
          </EditorContainer>
        )}

        {images.length > 0 && (
          <ImagePreviewContainer>
            <ImagePreviewTitle>
              <FaImage /> 대표 이미지 선택
            </ImagePreviewTitle>
            <ImageList>
              {images.map((img, index) => (
                <ImageItem
                  key={index}
                  selected={img === selectedImage}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`미리보기 ${index + 1}`} />
                </ImageItem>
              ))}
            </ImageList>
          </ImagePreviewContainer>
        )}
        <ButtonContainer>
          <PreviewButton type="button" onClick={togglePreview}>
            {isPreview ? <FaPencilAlt /> : <FaEye />}
            {isPreview ? '편집' : '미리보기'}
          </PreviewButton>
          <SubmitButton type="submit">
            <FaCheck />
            작성 완료
          </SubmitButton>
        </ButtonContainer>
      </form>
    </WritePostContainer>
  );
};

export default WritePost;

const WritePostContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto; // 스크롤

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const Title = styled.h2`
  color: #ffd700;
  margin-bottom: 20px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  background-color: #333;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const EditorContainer = styled.div`
  .ql-container {
    min-height: 300px;
    font-size: 16px;
    background-color: #333;
    color: #e0e0e0;
    border-color: #444;
  }

  .ql-toolbar {
    background-color: #444;
    border-color: #555;

    .ql-stroke {
      stroke: #e0e0e0;
    }

    .ql-fill {
      fill: #e0e0e0;
    }

    .ql-picker {
      color: #e0e0e0;
    }
  }
`;

const PreviewContainer = styled.div`
  border: 1px solid #444;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #333;
  color: #e0e0e0;

  h3 {
    color: #ffd700;
    margin-bottom: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;

  svg {
    margin-right: 5px;
  }
`;

const PreviewButton = styled(Button)`
  background-color: #4a4a4a;
  color: #e0e0e0;

  &:hover {
    background-color: #5a5a5a;
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #ffd700;
  color: #1e1e1e;

  &:hover {
    background-color: #ffed4d;
    transform: translateY(-2px);
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 20px;
  background-color: #333;
  border-radius: 4px;
  padding: 15px;
`;

const ImagePreviewTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 5px;
  }
`;

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageItem = styled.div<{ selected: boolean }>`
  width: 100px;
  height: 100px;
  border: 2px solid ${(props) => (props.selected ? '#ffd700' : 'transparent')};
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
