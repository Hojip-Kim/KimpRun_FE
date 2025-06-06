import styled from 'styled-components';

// post content

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  word-break: keep-all;
  color: #ffd700;
`;

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  color: #aaa;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const AuthorAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #444;
  margin-right: 0.5rem;
`;

export const AuthorName = styled.span`
  font-weight: 600;
  color: #e0e0e0;
  margin-right: 0.5rem;
`;

export const PostDate = styled.span`
  color: #888;
`;

export const StatsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  color: #888;

  svg {
    margin-right: 0.3rem;
  }
`;

export const LikeButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #ffd700;
  }
`;

export const Content = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  word-break: keep-all;
  overflow-wrap: break-word;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.2em;
    margin-bottom: 0.5em;
    color: #ffd700;
  }

  h1 {
    font-size: 1.6rem;
  }
  h2 {
    font-size: 1.4rem;
  }
  h3 {
    font-size: 1.2rem;
  }
  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1em;
  }

  ul,
  ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }

  code {
    background-color: #444;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    color: #ffd700;
  }

  pre {
    background-color: #444;
    padding: 1em;
    overflow-x: auto;
    border-radius: 3px;
  }

  blockquote {
    border-left: 4px solid #ffd700;
    padding-left: 1em;
    color: #aaa;
  }

  a {
    color: #ffd700;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// page (main)
export const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  background-color: #2c2c2c;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  color: #e0e0e0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(21, 21, 21);
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  @media (min-width: 800px) {
    height: calc(100vh - 8rem);
    margin: 1rem auto;
    border-radius: 12px;
  }
`;

export const ScrollableCommentSection = styled.div`
  margin-top: 1rem;
`;

// comment section

export const CommentSectionContainer = styled.div`
  margin-top: 2rem;
  font-family: 'Arial', sans-serif;
`;

export const CommentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffd700;
`;

export const CommentWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const CommentItem = styled.div<{ depth: number }>`
  background-color: ${(props) => (props.depth % 2 === 0 ? '#333' : '#2c2c2c')};
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  margin-left: ${(props) => props.depth * 1.5}rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const CommentAuthor = styled.span`
  font-weight: 600;
  color: #e0e0e0;
`;

export const CommentDate = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

export const CommentContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: #e0e0e0;
  margin-bottom: 0.5rem;
`;

export const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.3rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

export const ChildComments = styled.div`
  margin-top: 1rem;
  margin-left: 1.5rem;
`;

export const CommentForm = styled.form`
  margin-bottom: 1.5rem;
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  height: 5rem;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 4px;
  resize: vertical;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  background-color: #333;
  color: #e0e0e0;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

export const CommentSubmitButton = styled.button`
  background-color: #ffd700;
  color: #1e1e1e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffed4d;
  }
`;
