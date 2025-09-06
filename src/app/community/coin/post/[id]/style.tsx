import styled from 'styled-components';
import { palette } from '@/styles/palette';

// post content

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  word-break: keep-all;
  color: ${palette.accent};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: ${palette.textMuted};
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${palette.border};

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }
`;

export const AuthorAvatar = styled.div`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${palette.accent} 0%,
    ${palette.accentRing} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${palette.bgPage};
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;

  &::before {
    content: '👤';
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.65rem;

    &::before {
      font-size: 0.8rem;
    }
  }
`;

export const AuthorName = styled.span`
  font-weight: 600;
  color: ${palette.textPrimary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  padding: 4px 8px;
  margin: -4px -8px;

  &:hover {
    color: ${palette.accent};
    background: ${palette.accentRing};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

export const PostDate = styled.span`
  color: ${palette.textMuted};
  font-size: 0.8rem;

  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  color: ${palette.textMuted};

  svg {
    margin-right: 0.3rem;
  }
`;

export const LikeButton = styled.button`
  background: none;
  border: none;
  color: ${palette.textMuted};
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: ${palette.accent};
  }
`;

export const Content = styled.div`
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  word-break: keep-all;
  overflow-wrap: break-word;

  /* Quill 기본 스타일 추가 */
  color: ${palette.textPrimary};

  /* 헤더 스타일링 */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    color: ${palette.accent};
    font-weight: 600;
  }

  h1 {
    font-size: 1.3rem;
  }
  h2 {
    font-size: 1.1rem;
  }
  h3 {
    font-size: 1rem;
  }
  h4,
  h5,
  h6 {
    font-size: 0.9rem;
  }

  /* 텍스트 스타일링 */
  p {
    margin-bottom: 1em;
    color: ${palette.textPrimary};
  }

  /* 리스트 스타일링 */
  ul,
  ol {
    margin-bottom: 1em;
    padding-left: 2em;
    color: ${palette.textPrimary};
  }

  li {
    margin-bottom: 0.5em;
  }

  /* Quill 특별 스타일 */
  .ql-align-center {
    text-align: center;
  }
  
  .ql-align-right {
    text-align: right;
  }
  
  .ql-align-left {
    text-align: left;
  }
  
  .ql-align-justify {
    text-align: justify;
  }

  /* 텍스트 포맷팅 */
  strong,
  .ql-bold {
    font-weight: bold;
  }

  em,
  .ql-italic {
    font-style: italic;
  }

  .ql-underline {
    text-decoration: underline;
  }

  .ql-strike {
    text-decoration: line-through;
  }

  /* 코드 블록 */
  code {
    background-color: ${palette.input};
    padding: 0.2em 0.4em;
    border-radius: 3px;
    color: ${palette.accent};
    font-family: 'Courier New', monospace;
  }

  pre {
    background-color: ${palette.input};
    padding: 1em;
    overflow-x: auto;
    border-radius: 3px;
    border: 1px solid ${palette.border};
  }

  .ql-code-block {
    background-color: ${palette.input};
    padding: 1em;
    border-radius: 3px;
    border: 1px solid ${palette.border};
    font-family: 'Courier New', monospace;
    color: ${palette.textPrimary};
    margin: 1em 0;
  }

  /* 인용구 */
  blockquote {
    border-left: 4px solid ${palette.accent};
    padding-left: 1em;
    margin: 1em 0;
    color: ${palette.textMuted};
    background-color: ${palette.input};
    border-radius: 0 3px 3px 0;
    padding: 0.5em 1em;
  }

  /* 링크 */
  a {
    color: ${palette.accent};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* 이미지 */
  img {
    max-width: 100%;
    width: auto;
    height: auto;
    border-radius: 4px;
    margin: 1em auto;
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    /* 데스크톱에서 최대 크기 제한 */
    @media (min-width: 769px) {
      max-width: 80%;
      max-height: 600px;
      object-fit: contain;
    }
  }

  /* Quill 에디터에서 생성되는 특수 클래스들 */
  .ql-indent-1 {
    padding-left: 2em;
  }
  .ql-indent-2 {
    padding-left: 4em;
  }
  .ql-indent-3 {
    padding-left: 6em;
  }

  /* 줄바꿈 처리 */
  br {
    content: '';
    display: block;
    margin: 0.5em 0;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;

    h1 {
      font-size: 0.9rem;
    }
    h2 {
      font-size: 0.85rem;
    }
    h3 {
      font-size: 0.8rem;
    }

    .ql-code-block,
    pre {
      font-size: 0.65rem;
      padding: 0.75em;
    }

    blockquote {
      padding: 0.4em 0.8em;
    }

    /* 모바일에서 이미지 크기 조정 */
    img {
      max-width: 95%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 3px;
      margin: 0.75em auto;
    }
  }

  @media (max-width: 480px) {
    /* 아주 작은 화면에서는 더 작게 */
    img {
      max-width: 100%;
      max-height: 250px;
      object-fit: contain;
      border-radius: 2px;
      margin: 0.5em auto;
    }
  }
`;

// page (main)
export const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  background-color: ${palette.card};
  box-shadow: ${palette.shadow};
  border-radius: 0;
  color: ${palette.textPrimary};

  @media (min-width: 800px) {
    margin: 1rem auto;
    border-radius: 12px;
  }
`;

export const ScrollableCommentSection = styled.div`
  margin-top: 1rem;
`;

// 게시글 제목과 액션 버튼 컨테이너
export const PostTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

// 작성자 액션 버튼들
export const AuthorActions = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: static;
  }
`;

export const ActionButton = styled.button`
  background: ${palette.card};
  border: 1px solid ${palette.border};
  color: ${palette.textSecondary};
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${palette.bgPage};
    color: ${palette.textPrimary};
    border-color: ${palette.textPrimary};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ActionsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 100;
  min-width: 140px;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 12px;
    width: 12px;
    height: 12px;
    background: ${palette.card};
    border: 1px solid ${palette.border};
    border-bottom: none;
    border-right: none;
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    top: calc(100% + 0.25rem);
    right: -0.5rem;
    min-width: 120px;

    &::before {
      right: 8px;
    }
  }
`;

export const ActionItem = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: none;
  border: none;
  color: ${palette.textPrimary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${palette.bgPage};
    color: ${palette.accent};
  }

  &:active {
    background: ${palette.border};
  }

  &.delete {
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// 편집 모드 스타일들
export const EditTitleInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 1px solid ${palette.border};
  border-radius: 12px;
  background: ${palette.card};
  color: ${palette.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${palette.textSecondary};
    font-weight: 400;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    padding: 0.875rem 1.25rem;
  }
`;

export const EditActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: #fbbf24;
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f59e0b;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.85rem;
  }
`;

export const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid ${palette.border};
  border-radius: 8px;
  background: ${palette.card};
  color: ${palette.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${palette.textPrimary};
    color: ${palette.textPrimary};
    background: ${palette.bgPage};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1rem;
    font-size: 0.85rem;
  }
`;

export const EditContentContainer = styled.div`
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid ${palette.border};
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ql-toolbar {
    border: none;
    border-bottom: 1px solid ${palette.border};
    background: ${palette.card};
    padding: 1rem 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    .ql-formats {
      margin-right: 1rem;

      &:last-child {
        margin-right: 0;
      }
    }

    button {
      border-radius: 6px;
      padding: 0.75rem;
      transition: all 0.2s ease;
      border: none;
      background: transparent;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: ${palette.bgPage};
      }

      &.ql-active {
        background: ${palette.accent};
        color: white;
      }

      svg {
        width: 18px !important;
        height: 18px !important;
      }
    }

    .ql-stroke {
      stroke: ${palette.textSecondary};
      transition: stroke 0.2s ease;
      stroke-width: 2;
    }

    .ql-fill {
      fill: ${palette.textSecondary};
      transition: fill 0.2s ease;
    }

    button:hover .ql-stroke,
    button.ql-active .ql-stroke {
      stroke: ${palette.accent};
    }

    button:hover .ql-fill,
    button.ql-active .ql-fill {
      fill: ${palette.accent};
    }

    button.ql-active .ql-stroke {
      stroke: white;
    }

    button.ql-active .ql-fill {
      fill: white;
    }

    .ql-picker {
      color: ${palette.textPrimary};
      height: 40px;
      padding: 0 0.75rem;
      display: flex;
      align-items: center;
      font-size: 14px;

      .ql-picker-label {
        padding: 0;
        display: flex;
        align-items: center;

        &::before {
          font-size: 14px;
        }
      }
    }

    .ql-picker-options {
      background: ${palette.card};
      border: 1px solid ${palette.border};
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      padding: 0.5rem 0;

      .ql-picker-item {
        padding: 0.5rem 1rem;
        font-size: 14px;

        &:hover {
          background: ${palette.bgPage};
        }
      }
    }
  }

  .ql-container {
    border: none;
    background: ${palette.card};
    font-family: inherit;
  }

  .ql-editor {
    min-height: 400px;
    padding: 2rem;
    color: ${palette.textPrimary};
    font-size: 1rem;
    line-height: 1.7;
    font-family: inherit;

    &.ql-blank::before {
      color: ${palette.textSecondary};
      font-style: normal;
      opacity: 0.6;
    }

    h1,
    h2,
    h3 {
      color: ${palette.textPrimary};
      margin: 1.5rem 0 1rem 0;
      font-weight: 600;
    }

    p {
      margin: 0.75rem 0;
    }

    blockquote {
      border-left: 4px solid ${palette.accent};
      background: ${palette.bgPage};
      margin: 1rem 0;
      padding: 1rem 1.5rem;
      border-radius: 0 8px 8px 0;
    }

    code {
      background: ${palette.bgPage};
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    }

    pre {
      background: ${palette.bgPage};
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }

    a {
      color: ${palette.accent};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    ul,
    ol {
      padding-left: 1.5rem;
    }

    li {
      margin: 0.5rem 0;
    }
  }

  @media (max-width: 768px) {
    margin: 1.5rem 0;

    .ql-toolbar {
      padding: 0.75rem 1rem;
    }

    .ql-editor {
      min-height: 300px;
      padding: 1.5rem 1rem;
    }
  }
`;

// comment section

export const CommentSectionContainer = styled.div`
  margin-top: 2rem;
  font-family: 'Arial', sans-serif;
`;

export const CommentTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  color: ${palette.accent};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }
`;

export const CommentWrapper = styled.div`
  margin-bottom: 0.8rem;

  @media (max-width: 768px) {
    margin-bottom: 0.6rem;
  }
`;

export const CommentItem = styled.div<{ depth: number }>`
  background-color: ${(props) =>
    props.depth % 2 === 0 ? palette.card : palette.input};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  padding: 0.75rem;
  margin-left: ${(props) => props.depth * 1.2}rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.6rem;
    margin-left: ${(props) => props.depth * 0.8}rem;
  }
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
`;

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: ${palette.textPrimary};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 6px;
  margin: -2px -6px;

  &:hover {
    color: ${palette.accent};
    background: ${palette.accentRing};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const CommentDate = styled.span`
  font-size: 0.7rem;
  color: ${palette.textMuted};

  @media (max-width: 768px) {
    font-size: 0.55rem;
  }
`;

export const AuthorTag = styled.span`
  display: inline-block;
  background: ${palette.accent};
  color: ${palette.bgPage};
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  margin-right: 6px;
  border: 1px solid ${palette.border};

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 1px 4px;
    margin-right: 4px;
  }
`;

export const CommentContent = styled.p`
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${palette.textPrimary};
  margin-bottom: 0.6rem;
  margin-top: 0.4rem;

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: ${palette.accent};
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
  transition: all 0.2s ease;

  svg {
    margin-right: 0.25rem;
    font-size: 0.7rem;
  }

  &:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

export const ChildComments = styled.div`
  margin-top: 1rem;
  margin-left: 1.5rem;
`;

export const CommentForm = styled.form`
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  height: 3.5rem;
  padding: 0.6rem;
  border: 1px solid ${palette.border};
  border-radius: 6px;
  resize: vertical;
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
  background-color: ${palette.input};
  color: ${palette.textPrimary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${palette.accent};
    box-shadow: 0 0 0 2px ${palette.accentRing};
    height: 4.5rem;
  }

  &::placeholder {
    color: ${palette.textMuted};
  }

  @media (max-width: 768px) {
    height: 3rem;
    font-size: 0.65rem;

    &:focus {
      height: 4rem;
    }
  }
`;

export const CommentSubmitButton = styled.button`
  background-color: ${palette.accent};
  color: ${palette.bgPage};
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
  align-self: flex-end;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${palette.accentRing};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 0.35rem 0.8rem;
  }
`;

// 새로운 스타일 컴포넌트 추가
export const AuthWarning = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.1) 0%,
    rgba(255, 193, 7, 0.05) 100%
  );
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: ${palette.textSecondary};
  font-size: 0.85rem;
  text-align: center;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.8rem;
  }
`;

export const CommentFormWrapper = styled.div`
  margin-bottom: 1.5rem;
  background: ${palette.card};
  border: 1px solid ${palette.borderSoft};
  border-radius: 8px;
  padding: 0.8rem;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${palette.accent};
    box-shadow: 0 0 0 2px ${palette.accentRing};
  }

  @media (max-width: 768px) {
    padding: 0.6rem;
  }
`;

// 김프가 스타일 새로운 컴포넌트들
export const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${palette.borderSoft};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    position: relative;
  }
`;

export const PostStatsBar = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: space-around;
    gap: 0.5rem;
    padding: 0.5rem;
    background: ${palette.input};
    border-radius: 8px;
  }
`;

export const StatItem = styled.div`
  font-size: 0.85rem;
  color: ${palette.textSecondary};

  strong {
    color: ${palette.textPrimary};
    font-weight: 600;
    margin-left: 0.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

export const LikeButtonProminent = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 200px;
  margin: 2rem auto 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #8b4513;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);

  svg {
    font-size: 1rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
    background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.4rem 0.8rem;
    max-width: 120px;
    margin: 1rem auto 0.5rem;

    svg {
      font-size: 0.8rem;
    }
  }
`;
