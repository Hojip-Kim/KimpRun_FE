'use client';

import React from 'react';
import CommunityLayout from '../../coin/client/CommunityLayout';
import CommunitySubNav from '../../coin/client/CommunitySubNav';
import ComingSoon from '@/components/common/ComingSoon';
import { BoardContainer } from '../../coin/client/style';

const ExpertClient: React.FC = () => {
  return (
    <CommunityLayout>
      <CommunitySubNav currentPath="/community/expert" />
      <BoardContainer>
        <ComingSoon
          title="전문가 게시판 준비중"
          description="검증된 암호화폐 전문가들의 전문적인 시장 분석과 투자 인사이트를 공유하는 프리미엄 커뮤니티 공간을 준비하고 있습니다."
          icon="👨‍💼"
          showBackButton={false}
          variant="embedded"
        />
      </BoardContainer>
    </CommunityLayout>
  );
};

export default ExpertClient;
