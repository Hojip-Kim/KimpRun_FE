import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: '정보 | 김프런',
  description:
    '암호화폐 코인 순위, 거래소 순위, 도미넌스 맵, 차트 맵 등 다양한 정보를 확인하세요.',
  keywords: [
    '암호화폐정보',
    '코인순위',
    '거래소순위',
    '도미넌스',
    '차트맵',
    '김프런',
  ],
};

const InformationPage = () => {
  redirect('/information/coin-ranking?page=1&size=100');
};

export default InformationPage;
