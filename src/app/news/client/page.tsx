'use client';

import React from 'react';
import ComingSoon from '@/components/common/ComingSoon';

const NewsClientPage = () => {
  return (
    <ComingSoon
      title="뉴스 서비스 준비중"
      description="암호화폐 관련 최신 뉴스와 시장 분석을 제공할 예정입니다."
      icon="📰"
      showBackButton={true}
    />
  );
};

export default NewsClientPage;
