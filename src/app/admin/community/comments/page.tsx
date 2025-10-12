import React from 'react';
import { Metadata } from 'next';
import CommentManagement from '../../client/CommentManagement';

// 검색엔진 차단
export const metadata: Metadata = {
  title: '댓글 관리 - Admin',
  robots: {
    index: false,
    follow: false,
  },
};

// 동적렌더링 강제
export const dynamic = 'force-dynamic';

export default function CommentsPage() {
  return <CommentManagement />;
}
