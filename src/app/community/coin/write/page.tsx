'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FaEye, FaPencilAlt, FaCheck, FaImage } from 'react-icons/fa';
import type ReactQuill from 'react-quill';
import { useGlobalAlert } from '@/providers/AlertProvider';

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
import { clientRequest } from '@/server/fetch';
import { palette } from '@/styles/palette';
import Modal from '@/components/modal/modal';
import Dropdown, { DropdownOption } from '@/components/common/Dropdown';
import { getCategories } from '@/app/community/actions';
import { CommunityWriteSkeleton } from '@/components/skeleton/Skeleton';

const WritePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [categories, setCategories] = useState<DropdownOption<number>[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quillRef = useRef<ReactQuill>(null);

  const router = useRouter();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const { showError, showWarning } = useGlobalAlert();

  useEffect(() => {
    if (!isAuthenticated) {
      showWarning('로그인 후 이용해주세요.');
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await getCategories();
        if (response.success && response.data) {
          const categoryData = Array.isArray(response.data)
            ? response.data
            : (response.data as any)?.categories || [];

          const categoryOptions: DropdownOption<number>[] = categoryData.map(
            (cat: any) => ({
              label: cat.categoryName,
              value: cat.id,
            })
          );

          setCategories(categoryOptions);
          
          // 기본값을 첫 번째 카테고리로 설정
          if (categoryOptions.length > 0) {
            setSelectedCategory(categoryOptions[0].value);
          }
        }
      } catch (error) {
        console.error('카테고리 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  const createPost = async () => {
    try {
      setIsSubmitting(true);
      const response = await clientRequest.post(
        `/board/${selectedCategory}/create`,
        {
          title,
          content,
          previewImage: selectedImage,
        }
      );

      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        showError('게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      showError('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    // 새로고침과 함께 게시판으로 이동
    window.location.href = `/community/coin/${selectedCategory}?page=1&size=15`;
  };

  // 성공 모달 컴포넌트
  const SuccessModalContent = () => (
    <SuccessModalContainer>
      <SuccessIconWrapper>
        <SuccessCheckIcon>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SuccessCheckIcon>
      </SuccessIconWrapper>
      <SuccessTitle>게시글 작성 완료!</SuccessTitle>
      <SuccessMessage>
        게시글이 성공적으로 작성되었습니다.
        <br />
        <SuccessSubMessage>작성하신 글을 지금 확인해보세요</SuccessSubMessage>
      </SuccessMessage>
      <SuccessButtonContainer>
        <SuccessButton onClick={handleSuccessConfirm}>
          <ButtonIcon>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 9L12 13L16 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ButtonIcon>
          게시판으로 이동
        </SuccessButton>
      </SuccessButtonContainer>
    </SuccessModalContainer>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // 에디터 컨테이너 클릭 시 에디터에 포커스
  const handleEditorContainerClick = (e: React.MouseEvent) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      // 클릭한 위치가 에디터 영역이 아닌 경우에만 포커스 설정
      const editorElement = quill.root;
      const rect = editorElement.getBoundingClientRect();
      const clickY = e.clientY;

      if (clickY > rect.bottom) {
        // 에디터 하단 빈 공간을 클릭한 경우, 마지막 위치에 커서 설정
        const length = quill.getLength();
        quill.setSelection(length - 1, 0);
      }

      // 에디터에 포커스
      quill.focus();
    }
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
          [{ header: [1, 2, 3, false] }],
          [{ font: [] }],
          [{ size: ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          ['blockquote', 'code-block'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          [{ direction: 'rtl' }],
          [{ align: [] }],
          ['link', 'image', 'video'],
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
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
  ];

  // 로딩 상태일 때 스켈레톤 표시
  if (isLoading) {
    return <CommunityWriteSkeleton />;
  }

  return (
    <WritePostContainer>
      <WriteCard>
        <WriteHeader>
          <Title>글 작성</Title>
          <Subtitle>새로운 게시글을 작성해보세요</Subtitle>
        </WriteHeader>
        <WriteContent>
          <form onSubmit={handleSubmit}>
            <CategoryContainer>
              <CategoryLabel htmlFor="category">카테고리</CategoryLabel>
              <Dropdown
                options={categories}
                value={selectedCategory}
                onChange={(value: number) => setSelectedCategory(value)}
              />
            </CategoryContainer>

            <FormGroup>
              <Label htmlFor="title">제목</Label>
              <TitleInput
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="어떤 이야기를 나누고 싶으신가요?"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="content">내용</Label>
              {isPreview ? (
                <PreviewContainer>
                  <h3>{title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </PreviewContainer>
              ) : (
                <EditorContainer onClick={handleEditorContainerClick}>
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
            </FormGroup>

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
                      <img src={img} alt={`미리보기 ${index + 1}`} loading="lazy" width="100" height="100" />
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
              <SubmitButton type="submit" disabled={isSubmitting}>
                <FaCheck />
                {isSubmitting ? '작성 중...' : '작성 완료'}
              </SubmitButton>
            </ButtonContainer>
          </form>
        </WriteContent>
      </WriteCard>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <Modal
          width={420}
          height={320}
          element={<SuccessModalContent />}
          setModal={setShowSuccessModal}
        />
      )}
    </WritePostContainer>
  );
};

export default WritePost;

// 카테고리 선택 스타일
const CategoryContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const CategoryLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  letter-spacing: 0.025em;
`;

// 성공 모달 스타일 - 모던 디자인
const SuccessModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem;
  text-align: center;
  background: ${palette.card};
  border-radius: 20px;
  box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid ${palette.border};
  min-width: 320px;
  max-width: 400px;
`;

const SuccessIconWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SuccessCheckIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: successPulse 0.8s ease-out;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);

  svg {
    width: 36px;
    height: 36px;
    stroke-width: 3;
  }

  @keyframes successPulse {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.2),
      rgba(5, 150, 105, 0.1)
    );
    animation: ripple 2s infinite;
  }

  @keyframes ripple {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
`;

const SuccessTitle = styled.h2`
  color: ${palette.textPrimary};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, ${palette.accent}, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SuccessMessage = styled.div`
  color: ${palette.textSecondary};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const SuccessSubMessage = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${palette.textMuted};
  font-style: italic;
`;

const SuccessButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SuccessButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, ${palette.accent}, #10b981);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const ButtonIcon = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const WritePostContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0;
  color: ${palette.textPrimary};

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 0 1rem;
    margin-bottom: 100px; /* 모바일 탭바 공간 */
  }
`;

const WriteCard = styled.div`
  background: ${palette.card};
  border-radius: 20px;
  border: 1px solid ${palette.border};
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

const WriteHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid ${palette.border};
  background: linear-gradient(135deg, ${palette.card}, ${palette.bgContainer});

  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
`;

const Title = styled.h1`
  background: linear-gradient(135deg, ${palette.accent}, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: ${palette.textSecondary};
  font-size: 1rem;
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const WriteContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${palette.textPrimary};
  letter-spacing: 0.025em;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 1.25rem 1.5rem;
  font-size: 1.125rem;
  background: ${palette.input};
  color: ${palette.textPrimary};
  border: 2px solid ${palette.border};
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 4px ${palette.accentRing};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${palette.textMuted};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border-radius: 12px;
  }
`;

const EditorContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${palette.border};
  backdrop-filter: blur(8px);
  margin-bottom: 1.5rem;

  .ql-container {
    min-height: 400px;
    font-size: 1rem;
    background: ${palette.input};
    color: ${palette.textPrimary};
    border: none;
    border-top: 1px solid ${palette.border};
    cursor: text; /* 전체 영역에서 텍스트 커서 표시 */

    /* 클릭 영역 확장을 위한 스타일 */
    .ql-editor {
      min-height: 400px;
      padding: 1.5rem;
      line-height: 1.6;
      cursor: text;

      /* 빈 에디터일 때도 클릭 가능하게 만들기 */
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      &.ql-blank::before {
        color: ${palette.textMuted};
        font-style: normal;
        pointer-events: none;
      }
    }

    @media (max-width: 768px) {
      min-height: 300px;
      font-size: 0.9rem;

      .ql-editor {
        min-height: 300px;
        padding: 1rem;
      }
    }
  }

  .ql-toolbar {
    background: ${palette.card};
    border: none;
    border-bottom: 1px solid ${palette.border};
    padding: 0.75rem;

    .ql-stroke {
      stroke: ${palette.textSecondary};
    }

    .ql-fill {
      fill: ${palette.textSecondary};
    }

    .ql-picker {
      color: ${palette.textSecondary};
    }

    .ql-picker-options {
      background: ${palette.card};
      border: 1px solid ${palette.border};
      border-radius: 4px;
      box-shadow: ${palette.shadow};
      z-index: 1000;
    }

    .ql-picker-item {
      color: ${palette.textPrimary};

      &:hover {
        background: ${palette.accentRing};
      }
    }

    /* 색상 선택기 스타일 */
    .ql-color-picker,
    .ql-background-picker {
      .ql-picker-options {
        padding: 0.5rem;
        width: auto;
      }
    }

    /* 폰트 크기 선택기 */
    .ql-size .ql-picker-options {
      .ql-picker-item[data-value='small']::before {
        content: '작게';
        font-size: 0.8rem;
      }

      .ql-picker-item[data-value='false']::before {
        content: '보통';
        font-size: 1rem;
      }

      .ql-picker-item[data-value='large']::before {
        content: '크게';
        font-size: 1.2rem;
      }

      .ql-picker-item[data-value='huge']::before {
        content: '매우 크게';
        font-size: 1.5rem;
      }
    }

    /* 헤더 선택기 */
    .ql-header .ql-picker-options {
      .ql-picker-item[data-value='1']::before {
        content: '제목 1';
        font-size: 2rem;
        font-weight: bold;
      }

      .ql-picker-item[data-value='2']::before {
        content: '제목 2';
        font-size: 1.5rem;
        font-weight: bold;
      }

      .ql-picker-item[data-value='3']::before {
        content: '제목 3';
        font-size: 1.25rem;
        font-weight: bold;
      }

      .ql-picker-item[data-value='false']::before {
        content: '본문';
        font-size: 1rem;
      }
    }

    button {
      color: ${palette.textSecondary};

      &:hover {
        color: ${palette.accent};
        background: ${palette.accentRing};
        border-radius: 4px;
      }

      &.ql-active {
        color: ${palette.accent};
        background: ${palette.accentRing};
      }
    }
  }

  /* 에디터 전체 영역 클릭 가능하게 만들기 */
  &:focus-within {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px ${palette.accentRing};
  }
`;

const PreviewContainer = styled.div`
  border: 1px solid ${palette.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: ${palette.input};
  color: ${palette.textPrimary};
  backdrop-filter: blur(8px);

  h3 {
    color: ${palette.accent};
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  /* Quill 콘텐츠 스타일링 */
  .ql-editor {
    padding: 0;
    border: none;
    font-size: inherit;
    line-height: 1.6;
  }

  /* 헤더 스타일 */
  h1,
  .ql-size-huge {
    font-size: 2rem;
    font-weight: 700;
    color: ${palette.accent};
    margin: 1rem 0;
  }

  h2,
  .ql-size-large {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${palette.textPrimary};
    margin: 0.8rem 0;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${palette.textSecondary};
    margin: 0.6rem 0;
  }

  /* 텍스트 스타일 */
  p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  /* 강조 스타일 */
  strong {
    font-weight: 700;
    color: ${palette.accent};
  }

  em {
    font-style: italic;
    color: ${palette.textSecondary};
  }

  u {
    text-decoration: underline;
  }

  s {
    text-decoration: line-through;
    opacity: 0.7;
  }

  /* 리스트 스타일 */
  ul,
  ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.25rem 0;
  }

  /* 인용문 스타일 */
  blockquote {
    border-left: 4px solid ${palette.accent};
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background: ${palette.accentRing};
    font-style: italic;
    color: ${palette.textSecondary};
  }

  /* 코드 블록 스타일 */
  pre {
    background: ${palette.bgContainer};
    border: 1px solid ${palette.border};
    border-radius: 4px;
    padding: 1rem;
    margin: 0.5rem 0;
    overflow-x: auto;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }

  code {
    background: ${palette.bgContainer};
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
  }

  /* 링크 스타일 */
  a {
    color: ${palette.accent};
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  /* 이미지 스타일 */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 0.5rem 0;
  }

  /* 정렬 스타일 */
  .ql-align-center {
    text-align: center;
  }

  .ql-align-right {
    text-align: right;
  }

  .ql-align-justify {
    text-align: justify;
  }

  /* 폰트 크기 스타일 */
  .ql-size-small {
    font-size: 0.8rem;
  }

  .ql-size-large {
    font-size: 1.2rem;
  }

  .ql-size-huge {
    font-size: 1.5rem;
  }

  /* Quill 텍스트 포맷팅 */
  .ql-bold {
    font-weight: bold;
  }

  .ql-italic {
    font-style: italic;
  }

  .ql-underline {
    text-decoration: underline;
  }

  .ql-strike {
    text-decoration: line-through;
  }

  /* Quill 폰트 패밀리 */
  .ql-font-serif {
    font-family: Georgia, Times New Roman, serif;
  }

  .ql-font-monospace {
    font-family: Monaco, Courier New, monospace;
  }

  /* Quill 상첨자/하첨자 */
  sub,
  .ql-script-sub {
    vertical-align: sub;
    font-size: smaller;
  }

  sup,
  .ql-script-super {
    vertical-align: super;
    font-size: smaller;
  }

  /* Quill 인덴트 */
  .ql-indent-1 {
    padding-left: 3em;
  }
  .ql-indent-2 {
    padding-left: 6em;
  }
  .ql-indent-3 {
    padding-left: 9em;
  }
  .ql-indent-4 {
    padding-left: 12em;
  }
  .ql-indent-5 {
    padding-left: 15em;
  }
  .ql-indent-6 {
    padding-left: 18em;
  }
  .ql-indent-7 {
    padding-left: 21em;
  }
  .ql-indent-8 {
    padding-left: 24em;
  }

  /* Quill 방향 */
  .ql-direction-rtl {
    direction: rtl;
    text-align: inherit;
  }

  /* Quill 비디오 */
  .ql-video {
    display: block;
    max-width: 100%;
  }

  /* Quill 코드 블록 */
  .ql-code-block-container {
    margin: 0.5rem 0;
  }

  pre.ql-syntax {
    background-color: ${palette.bgContainer};
    color: ${palette.textPrimary};
    overflow: visible;
    padding: 1rem;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h3 {
      font-size: 1.25rem;
    }

    h1,
    .ql-size-huge {
      font-size: 1.5rem;
    }

    h2,
    .ql-size-large {
      font-size: 1.25rem;
    }

    /* 모바일에서 인덴트 줄이기 */
    .ql-indent-1 {
      padding-left: 2em;
    }
    .ql-indent-2 {
      padding-left: 4em;
    }
    .ql-indent-3 {
      padding-left: 6em;
    }
    .ql-indent-4 {
      padding-left: 8em;
    }
    .ql-indent-5 {
      padding-left: 10em;
    }
    .ql-indent-6 {
      padding-left: 12em;
    }
    .ql-indent-7 {
      padding-left: 14em;
    }
    .ql-indent-8 {
      padding-left: 16em;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  svg {
    margin-right: 0.5rem;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.85rem;
  }
`;

const PreviewButton = styled(Button)`
  background: ${palette.card};
  color: ${palette.textPrimary};
  border: 1px solid ${palette.border};

  &:hover {
    background: ${palette.accentRing};
    color: ${palette.accent};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${palette.accentRing};
  }
`;

const SubmitButton = styled(Button)`
  background: ${palette.accent};
  color: ${palette.bgPage};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${palette.accentRing};
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1.5rem;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  padding: 1.5rem;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ImagePreviewTitle = styled.h3`
  color: ${palette.accent};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;

  svg {
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ImageList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ImageItem = styled.div<{ selected: boolean }>`
  width: 100px;
  height: 100px;
  border: 2px solid
    ${(props) => (props.selected ? palette.accent : palette.border)};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${palette.input};

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${palette.accentRing};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;