import React from 'react';
import { Metadata } from 'next';
import BoardManagement from '../../client/BoardManagement';

// 검색엔진 차단
export const metadata: Metadata = {
  title: '게시물 관리 - Admin',
  robots: {
    index: false,
    follow: false,
  },
};

// 동적렌더링 강제
export const dynamic = 'force-dynamic';

export default function BoardsPage() {
  return <BoardManagement />;
}
