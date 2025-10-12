import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ClientLayout from './components/client/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KIMPRUN - 암호화폐 가격 비교 및 프리미엄 정보',
    template: '%s | KIMPRUN'
  },
  description: '한국 최대 암호화폐 가격 비교 사이트 KIMPRUN. 업비트, 바이낸스 등 주요 거래소 가격을 실시간으로 비교하고 프리미엄 정보를 확인하세요.',
  keywords: [
    '암호화폐',
    '비트코인',
    '가격비교',
    '프리미엄',
    '업비트',
    '바이낸스',
    '코인원',
    '빗썸',
    'KIMPRUN',
    '김프런',
    '암호화폐 가격',
    '암호화폐 시세',
    '암호화폐 거래소',
    '비트코인 가격',
    '이더리움 가격'
  ],
  authors: [{ name: 'KIMPRUN Team' }],
  creator: 'KIMPRUN',
  publisher: 'KIMPRUN',
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL('https://kimprun.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://kimprun.com',
    title: 'KIMPRUN - 암호화폐 가격 비교 및 프리미엄 정보',
    description: '한국 최대 암호화폐 가격 비교 사이트 KIMPRUN. 업비트, 바이낸스 등 주요 거래소 가격을 실시간으로 비교하고 프리미엄 정보를 확인하세요.',
    siteName: 'KIMPRUN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KIMPRUN - 암호화폐 가격 비교 사이트',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIMPRUN - 암호화폐 가격 비교 및 프리미엄 정보',
    description: '한국 최대 암호화폐 가격 비교 사이트 KIMPRUN',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/logo.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ height: '100%' }}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-W85QQMM9');
            `,
          }}
        />
        
        {/* 구조화된 데이터 - 웹사이트 정보 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "KIMPRUN",
              "url": "https://kimprun.com",
              "description": "한국 최대 암호화폐 가격 비교 사이트",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://kimprun.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "KIMPRUN",
                "url": "https://kimprun.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://kimprun.com/logo.png"
                }
              }
            })
          }}
        />
        
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body style={{ margin: 0, padding: 0, height: '100%' }}>
        {/* Google Tag Manager */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W85QQMM9"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
