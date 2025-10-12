import React from 'react';
import { parseDate } from '@/utils/dateUtils';

interface StructuredDataProps {
  data: Record<string, any>;
}

const StructuredData = ({ data }: StructuredDataProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default StructuredData;

// 게시글용 구조화된 데이터 생성 함수
export const createArticleStructuredData = (boardData: {
  title: string;
  content: string;
  memberNickName: string;
  createdAt: Date | string | number[];
  updatedAt: Date | string | number[];
  categoryName: string;
  boardId: number;
}) => {
  // 날짜를 안전하게 ISO 문자열로 변환하는 헬퍼 함수
  const toISOString = (date: Date | string | number[]): string => {
    const parsedDate = parseDate(date);
    if (!parsedDate) {
      return new Date().toISOString(); // fallback
    }
    return parsedDate.toISOString();
  };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": boardData.title,
    "description": boardData.content.replace(/<[^>]*>/g, '').substring(0, 160),
    "author": {
      "@type": "Person",
      "name": boardData.memberNickName
    },
    "datePublished": toISOString(boardData.createdAt),
    "dateModified": toISOString(boardData.updatedAt),
    "publisher": {
      "@type": "Organization",
      "name": "KIMPRUN",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kimprun.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://kimprun.com/community/coin/post/${boardData.boardId}`
    },
    "articleSection": boardData.categoryName,
    "inLanguage": "ko-KR"
  };
};

// 웹사이트용 구조화된 데이터
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "KIMPRUN",
  "url": "https://kimprun.com",
  "description": "한국 최대 암호화폐 가격 비교 사이트 Kimprun",
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
};

// 금융 서비스용 구조화된 데이터
export const financialServiceStructuredData = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "KIMPRUN",
  "description": "암호화폐 가격 비교 및 분석 서비스",
  "url": "https://kimprun.com",
  "logo": "https://kimprun.com/logo.png",
  "serviceType": "암호화폐 가격 비교",
  "areaServed": {
    "@type": "Country",
    "name": "South Korea"
  },
  "availableLanguage": "Korean"
};