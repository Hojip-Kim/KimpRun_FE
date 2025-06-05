import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ClientLayout from './components/client/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KIMPRUN',
  description: 'kimprun',
  icons: {
    icon: {
      url: '/logo.png',
      sizes: '256x256',
      type: 'image/png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ height: '100%', overflow: 'hidden' }}>
      <head></head>
      <body
        style={{ margin: 0, padding: 0, height: '100%', overflow: 'hidden' }}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
