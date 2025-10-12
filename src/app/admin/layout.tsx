import { Metadata } from 'next';
import AdminLayoutClient from './components/AdminLayoutClient';

// 검색엔진 차단을 위한 메타데이터
export const metadata: Metadata = {
  title: 'Admin - Kimprun',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
