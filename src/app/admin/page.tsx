import { redirect } from 'next/navigation';

// 동적렌더링 강제
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  // 기본 admin 페이지 접속 시 categories로 리다이렉트
  redirect('/admin/categories');
}
