'use client';

import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import store, { RootState } from '@/redux/store';
import Nav from '../../../components/nav/Nav';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { LayoutWrapper, MainContent } from './style';
import MobileTabBar from '@/components/nav/MobileTabBar';
import dynamic from 'next/dynamic';

const MobileChatFab = dynamic(() => import('@/components/chat/MobileChatFab'), { ssr: false });
const DesktopChatFab = dynamic(() => import('@/components/chat/DesktopChatFab'), { ssr: false });
import MobileThemeFab from '@/components/theme/MobileThemeFab';
import MobileNoticeFab from '@/components/notice/MobileNoticeFab';
import ScrollFab from '@/components/common/ScrollFab';
import Footer from '@/components/footer/Footer';
import ThemeProvider from '@/components/theme/ThemeProvider';
import { AlertProvider } from '@/providers/AlertProvider';

// React Query Client 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 후 stale
      gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
      refetchOnWindowFocus: true, // 윈도우 포커스 시 재요청
      refetchOnReconnect: true, // 재연결 시 재요청
      retry: 1, // 실패 시 1번 재시도
    },
  },
});

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AlertProvider>
              <TitleUpdater />
              <Nav />
              <LayoutWrapper>
                <MainContent>{children}</MainContent>
                <Footer />
              </LayoutWrapper>
              {/* Fixed 요소들을 LayoutWrapper 외부로 이동 - viewport 기준 위치 적용 */}
              <MobileTabBar />
              <MobileThemeFab />
              <MobileChatFab />
              <DesktopChatFab />
              <MobileNoticeFab />
              <ScrollFab />
            </AlertProvider>
          </ThemeProvider>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

const TitleUpdater = () => {
  const token = useSelector((state: RootState) => state.widget.token);
  const tokenPrice = useSelector((state: RootState) => state.widget.tokenPrice);
  const kimp = useSelector((state: RootState) => state.widget.kimp);
  useEffect(() => {
    document.title = `${token} : ${tokenPrice} ${
      kimp === -100 || kimp === undefined ? '' : `(${kimp?.toFixed(2)})`
    }`;
  }, [token, tokenPrice, kimp]);

  return null;
};

export default ClientLayout;
